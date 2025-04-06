describe("Registro de usuario", () => {
  const selectors = {
    nameInput: "input[name='name']",
    lastnameInput: "input[name='lastname']",
    emailInput: "input[name='email']",
    addressInput: "input[name='address']",
    passwordInput: "input[name='password']",
    confirmPasswordInput: "input[name='confirmPassword']",
    form: "form",
    successMessage: "p.text-green-500",
  };

  const errorMessages = {
    allFieldsRequired: "Ingrese un nombre válido",
    allFieldsRequired0: "Ingrese un apellido válido",
    invalidEmail:
      "Ingrese un email válido. Ej: juanperez@gmail.com",
    shortPassword: "Debe tener al menos 8 caracteres",
    passwordMismatch: "Ingrese una contraseña válida",
    emailInUse:
      "Las credenciales ya están en uso. Intente con datos diferentes",
    successRegistration: "Registro exitoso",
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/register");
    cy.url().should("include", "/register");
  });

  const submitFormAndCheckError = (errorMessage: string, timeout = 10000) => {
    cy.get(selectors.form).submit();
    cy.wait(2000);
    cy.contains(errorMessage, { timeout }).should("be.visible");
  };

  const testFieldValidation = (field: keyof BaseUser, errorMessage: string) => {
    it(`Debe validar que el campo '${field}' esté lleno antes de enviar el formulario`, () => {
      cy.generateUser().then((user) => {
        user[field] = "";
        cy.log("User:", JSON.stringify(user));
        cy.register(user);
        cy.wait(2000);
        submitFormAndCheckError(errorMessage);
      });
    });
  };

  testFieldValidation("firstName", errorMessages.allFieldsRequired);
  testFieldValidation("lastName", errorMessages.allFieldsRequired0);
  testFieldValidation("email", errorMessages.invalidEmail);
  testFieldValidation("password", errorMessages.shortPassword);

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
      cy.get(selectors.nameInput).type(user.firstName);
      cy.get(selectors.lastnameInput).type(user.lastName);
      cy.get(selectors.emailInput).type(user.email);
      cy.get(selectors.addressInput).type(user.address);
      cy.get(selectors.passwordInput).type(user.password);
      cy.get(selectors.confirmPasswordInput).type("diferente123");
      cy.get(selectors.form).submit();
      cy.contains("Las contraseñas no coinciden").should("exist");
    });
  });

  it("Debe registrar un usuario exitosamente", () => {
    cy.generateUser().then((user) => {
      cy.log("User:", JSON.stringify(user));
      cy.register(user);
      cy.contains("Registro exitoso").should("exist");
      cy.url({ timeout: 3000 }).should("include", "/login");
    });
  });
});
