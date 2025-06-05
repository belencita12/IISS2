describe("Reporte de compras - Admin", () => {
  const SESSION_KEY = "adminSession";
  const USER = {
    email: Cypress.env("USER_EMAIL_ADMIN"),
    password: Cypress.env("USER_PASSWORD_ADMIN"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/dashboard/purchases");
  });

  it("Debe generar un PDF correctamente al elegir fechas válidas", () => {
    // Fechas válidas
    const startDate = "2025-05-01";
    const endDate = "2025-05-20";

    // Ingresar fechas por ID
    cy.get('input[type="date"]#from').type(startDate);
    cy.get('input[type="date"]#to').type(endDate);

    // Interceptar descarga
    cy.intercept("GET", "**/purchase/report**").as("getReport");

    // Click en exportar
    cy.contains("button", "Exportar").click();

    cy.wait("@getReport").its("response.statusCode").should("eq", 200);
  });


  it("Debe activar el botón Exportar desde UI con fechas cargadas", () => {
    cy.get('input[type="date"]#from').type("2025-05-01");
    cy.get('input[type="date"]#to').type("2025-05-20");

    cy.get("button").contains("Exportar").should("not.be.disabled").click();
  });
});
