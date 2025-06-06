describe("Registro de Empleados", () => {
  const SESSION_KEY = "sessionToken";
  const USER = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A"),
  };

  const TIMEOUT = 20000;
  const uniqueEmail = "correo.ya@registrado.com"; // Este debe estar previamente registrado en tu sistema

  function seleccionarOpcionCombobox(texto: string, timeout = TIMEOUT) {
    cy.get('div[role="option"]', { timeout })
      .contains(texto)
      .should("be.visible")
      .click();
  }

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/dashboard/employee");
  });

  it("Debe mostrar mensajes de error cuando se intenta enviar el formulario vacío", () => {
    cy.get("button").contains("Registrar").click();

    cy.wait(5000);

    cy.get("button").contains("Registrar").click(); 

    cy.contains("El RUC es obligatorio").should("be.visible");
    cy.contains("El nombre completo es obligatorio").should("be.visible");
    cy.contains("Correo electrónico inválido").should("be.visible");
    cy.contains("Debe seleccionar un puesto").should("be.visible");
    cy.contains("El número de teléfono es obligatorio").should("be.visible");
  });

  it("Debe registrar un empleado exitosamente con un email único", () => {
    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/work-position?page=1`).as("getWorkPosition");

    cy.get("button").contains("Registrar").click();

    cy.wait("@getWorkPosition", { timeout: TIMEOUT });

    const randomNumber = Math.floor(Math.random() * 100000);
    const generatedEmail = `testuser${randomNumber}@gmail.com`;

    cy.get('input[placeholder="Ingrese el RUC"]').type(`${Math.floor((Math.random() + 1) * 1000000)}-1`);
    cy.get('input[placeholder="Ingrese el nombre"]').type("Juan Pérez");
    cy.get('input[placeholder="Ingrese el correo electrónico"]').type(generatedEmail);
    cy.get('input[placeholder="Ingrese el número de teléfono"]').type(`+595983${randomNumber * 10}`);

    cy.get('button[role="combobox"]').should("be.visible").click();
    seleccionarOpcionCombobox("Auxiliar");

    cy.contains("button", "Registrar").click();

    cy.contains("Empleado registrado correctamente").should("be.visible");
  });

 /* it("Debe mostrar error al registrar un empleado con el mismo email", () => {
    cy.get("button").contains("Registrar").click();

    cy.get('input[placeholder="Ingrese el RUC"]').type(`${Math.floor((Math.random() + 1) * 1000000)}-1`);
    cy.get('input[placeholder="Ingrese el nombre"]').type("Juan Pérez");
    cy.get('input[placeholder="Ingrese el correo electrónico"]').type(uniqueEmail);

    cy.get('button[role="combobox"]').should("be.visible").click();
    seleccionarOpcionCombobox("Auxiliar");

    cy.contains("button", "Registrar").click();

    cy.contains("Hubo un error desconocido", { timeout: TIMEOUT }).should("be.visible");
  });*/
});
