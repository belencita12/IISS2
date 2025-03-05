describe("Registro de usuario", () => {
  const testData = {
    validUser: {
      name: "Lourdes",
      lastname: "Valenzuela",
      email: "test1@gmail.com",
      password: "lourdes123",
      confirmPassword: "lourdes123"
    },
    existingEmail: "test1@gmail.com"
  };

  const selectors = {
    nameInput: "input[name='name']",
    lastnameInput: "input[name='lastname']",
    emailInput: "input[name='email']",
    passwordInput: "input[name='password']",
    confirmPasswordInput: "input[name='confirmPassword']",
    form: "form",
    successMessage: "p.text-green-500"
  };

  const errorMessages = {
    allFieldsRequired: "Todos los campos son obligatorios.",
    invalidEmail: "Por favor, introduce un email válido. Ej: juanperez@gmail.com",
    shortPassword: "La contraseña debe tener al menos 8 caracteres.",
    passwordMismatch: "Las contraseñas no coinciden",
    emailInUse: "Las credenciales ya están en uso. Intente con datos diferentes",
    successRegistration: "Registro exitoso. Redirigiendo..."
  };

  beforeEach(() => {
    cy.visit("/register");
    cy.url().should("include", "/register");
  });

  const fillForm = (userData = {}) => {
    const defaultData = {
      name: "Ian",
      lastname: "Ramirez",
      email: "ramirez@gmail.com",
      password: "ramirez123",
      confirmPassword: "ramirez123"
    };

    const formData = { ...defaultData, ...userData };

    if (formData.name) cy.get(selectors.nameInput).clear().type(formData.name);
    if (formData.lastname) cy.get(selectors.lastnameInput).clear().type(formData.lastname);
    if (formData.email) cy.get(selectors.emailInput).clear().type(formData.email);
    if (formData.password) cy.get(selectors.passwordInput).clear().type(formData.password);
    if (formData.confirmPassword) cy.get(selectors.confirmPasswordInput).clear().type(formData.confirmPassword);
  };

  const submitFormAndCheckError = (errorMessage: string, timeout: number = 10000) => {
    cy.get(selectors.form).submit();
    cy.wait(800);
    cy.contains(errorMessage, { timeout }).should("be.visible");
  };
  
  const testFieldValidation = (field: string, skipField: string) => {
    it(`Debe validar que el campo '${field}' esté lleno antes de enviar el formulario`, () => {
      const skipData = { [skipField]: '' };
      fillForm(skipData);
      submitFormAndCheckError(errorMessages.allFieldsRequired);
    });
  };

  testFieldValidation('name', 'name');
  testFieldValidation('lastname', 'lastname');
  testFieldValidation('email', 'email');
  testFieldValidation('password', 'password');

  it("Debe mostrar error si el correo electrónico tiene un formato inválido", () => {
    fillForm({ email: "ianramirez.com" });
    submitFormAndCheckError(errorMessages.invalidEmail);
  });

  it("Debe validar correo electrónico cuando pierde el foco", () => {
    fillForm({ email: "" });
    cy.get(selectors.emailInput).focus().blur();
    cy.wait(800);
    cy.contains(errorMessages.invalidEmail, { timeout: 10000 }).should("be.visible");
  });

  it("Debe mostrar un error si la contraseña es demasiado corta", () => {
    fillForm({ password: "12345", confirmPassword: "12345" });
    submitFormAndCheckError(errorMessages.shortPassword);
  });

  it("Debe validar que las contraseñas coincidan antes de enviar", () => {
    fillForm({ confirmPassword: "ramirez" });
    submitFormAndCheckError(errorMessages.passwordMismatch);
  });


  it("Debe registrar un usuario exitosamente", () => {
    fillForm(testData.validUser);
    cy.get(selectors.form).submit();
    
    cy.get(selectors.successMessage, { timeout: 10000 })
      .should('be.visible')
      .and('contain', errorMessages.successRegistration);
    
    cy.url({ timeout: 3000 }).should("include", "/login");
  });

  it("Debe mostrar error si el correo ya está registrado", () => {
    fillForm({ email: testData.existingEmail });
    submitFormAndCheckError(errorMessages.emailInUse);
  });
});