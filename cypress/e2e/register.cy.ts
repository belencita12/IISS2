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
    allFieldsRequired: "Todos los campos son obligatorios.",
    invalidEmail:
      "Por favor, introduce un email válido. Ej: juanperez@gmail.com",
    shortPassword: "La contraseña debe tener al menos 8 caracteres.",
    passwordMismatch: "Las contraseñas no coinciden",
    emailInUse:
      "Las credenciales ya están en uso. Intente con datos diferentes",
    successRegistration: "Registro exitoso. Redirigiendo...",
  };

  beforeEach(() => {
    cy.visit("/register");
    cy.url().should("include", "/register");
  });

  const submitFormAndCheckError = (errorMessage: string, timeout = 10000) => {
    cy.get(selectors.form).submit();
    cy.wait(800);
    cy.contains(errorMessage, { timeout }).should("be.visible");
  };

  const testFieldValidation = (field: keyof BaseUser) => {
    it(`Debe validar que el campo '${field}' esté lleno antes de enviar el formulario`, () => {
      cy.generateUser().then((user) => {
        user[field] = "";
        cy.log("User:", JSON.stringify(user));
        cy.register(user);
        submitFormAndCheckError(errorMessages.allFieldsRequired);
      });
    });
  };

  testFieldValidation("fullName");
  testFieldValidation("email");
  testFieldValidation("password");

  it("Debe mostrar error si el correo electrónico tiene un formato inválido", () => {
    cy.generateUser().then((user) => {
      cy.log("User:", JSON.stringify(user));
      user.email = "ianramirez.com";
      cy.register(user);
      submitFormAndCheckError(errorMessages.invalidEmail);
    });
  });

  it("Debe mostrar un error si la contraseña es demasiado corta", () => {
    cy.generateUser().then((user) => {
      user.password = "12345";
      cy.log("User:", JSON.stringify(user));
      cy.register(user);
      submitFormAndCheckError(errorMessages.shortPassword);
    });
  });

  it("Debe validar que las contraseñas coincidan antes de enviar", () => {
    cy.generateUser().then((user) => {
      cy.visit("/register");
      cy.log("User:", JSON.stringify(user));
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
      cy.log("User:", JSON.stringify(user));
      cy.register(user);
      cy.get(selectors.successMessage, { timeout: 10000 })
        .should("be.visible")
        .and("contain", errorMessages.successRegistration);
      cy.url({ timeout: 3000 }).should("include", "/login");
    });
  });
});
