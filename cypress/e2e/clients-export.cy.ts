describe("Reporte de clientes - Admin", () => {
  const SESSION_KEY = "adminSession";
  const USER = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/dashboard/clients");
  });

  it("Debe generar un reporte PDF correctamente al elegir un rango de fechas válido", () => {
    const startDate = "2025-01-01";
    const endDate = "2025-05-21";

    // Ingresar fechas en los filtros
    cy.get('input[type="date"]#from').type(startDate);
    cy.get('input[type="date"]#to').type(endDate);

    // Interceptar petición del reporte
    cy.intercept("GET", "**/client/report**").as("getClientReport");

    // Click en botón Exportar
    cy.contains("button", "Exportar").click();

    // Esperar y verificar respuesta
    cy.wait("@getClientReport").its("response.statusCode").should("eq", 200);
  });

  it("Debe activar el botón Exportar cuando se seleccionan fechas válidas", () => {
    cy.get('input[type="date"]#from').type("2025-01-01");
    cy.get('input[type="date"]#to').type("2025-05-21");

    cy.contains("Exportar").should("not.be.disabled").click();
  });

  it("Debe mostrar los filtros correctamente en la interfaz", () => {
    // Verifica inputs de fecha
    cy.get('input[type="date"]#from').should("exist").and("be.visible");
    cy.get('input[type="date"]#to').should("exist").and("be.visible");

    // Verifica botón de exportar
    cy.contains("Exportar").should("exist").and("be.visible");

    // Verifica algún texto indicativo
    cy.contains(/Clientes/i).should("be.visible");
  });
});
