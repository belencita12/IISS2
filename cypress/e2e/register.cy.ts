describe("Registro de usuario", () => {
  const selectors = {
    
    nameInput: "input[name='name']",
    lastnameInput: "input[name='lastname']",
    emailInput: "input[name='email']",
    passwordInput: "input[name='password']",
    confirmPasswordInput: "input[name='confirmPassword']",
    form: "form",
    successMessage: "p.text-green-500",
  };

  const errorMessages = {
    requiredName: "Ingrese un nombre válido",
    requiredLastname: "Ingrese un apellido válido",
    requiredEmail: "Ingrese un email válido. Ej: juanperez@gmail.com",
    requiredAddress: "Ingrese una dirección válida. Ej: Av. España 1234, Asunción, Paraguay",
    requiredPhone: "El número de telefono es obligatorio",
    requiredRuc: "El RUC o CI es obligatorio",
    shortPassword: "Debe tener al menos 8 caracteres",
    passwordMismatch: "Las contraseñas no coinciden",
    emailInUse: "Las credenciales ya están en uso. Intente con datos diferentes",
    successRegistration: "Registro exitoso. Redirigiendo...",
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/register");
    cy.url().should("include", "/register");
  });

  const submitFormAndCheckError = (errorMessage: string, timeout = 10000) => {
    cy.get(selectors.form).submit();
    cy.wait(800);
    cy.contains(errorMessage, { timeout }).should("be.visible");
  };

  const testFieldRequired = (field: keyof BaseUser, expectedError: string) => {
    it(`Debe validar que el campo '${field}' sea obligatorio`, () => {
      cy.generateUser().then((user) => {
        user[field] = "";
        cy.register(user);
        submitFormAndCheckError(expectedError);
      });
    });
  };

  testFieldRequired("fullName", errorMessages.requiredName);
  testFieldRequired("email", errorMessages.requiredEmail);
  testFieldRequired("address", errorMessages.requiredAddress);
  testFieldRequired("ruc", errorMessages.requiredRuc);
  testFieldRequired("phoneNumber", errorMessages.requiredPhone);

    it("Debe mostrar error si el correo electrónico tiene un formato inválido", () => {
    cy.generateUser().then((user) => {
      user.email = "ianramirez.com";
      cy.register(user);
      submitFormAndCheckError(errorMessages.requiredEmail);
    });
  });

  it("Debe mostrar un error si la contraseña es demasiado corta", () => {
    cy.generateUser().then((user) => {
      user.password = "12345";
      cy.register(user);
      submitFormAndCheckError(errorMessages.shortPassword);
    });
  });

  it("Debe validar que las contraseñas coincidan antes de enviar", () => {
    cy.generateUser().then((user) => {
      cy.get(selectors.nameInput).type(user.fullName);
      cy.get(selectors.lastnameInput).type(user.fullName);
      cy.get(selectors.emailInput).type(user.email);
      cy.get(selectors.passwordInput).type(user.password);
      cy.get(selectors.confirmPasswordInput).type("diferente123");
      cy.get(selectors.form).submit();
      submitFormAndCheckError(errorMessages.passwordMismatch);
    });
  });

it("Debe registrar un usuario exitosamente", () => {
  cy.generateUser().then((user) => {
    const timestamp = Date.now();

    user.email = `user${timestamp}@example.com`;
    user.password = `Password${timestamp}`;
    user.fullName = `Test${timestamp} User`;

    // Generar número de teléfono aleatorio en formato válido
    const randomPhone = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
    user.phoneNumber = `+595985${randomPhone}`;

    // Generar RUC válido y aleatorio
    user.ruc = `${timestamp.toString().slice(0, 6)}-${timestamp % 10}`;

    cy.register(user);
    //cy.url({ timeout: 3000 }).should("include", "/login");
  });
});




});
