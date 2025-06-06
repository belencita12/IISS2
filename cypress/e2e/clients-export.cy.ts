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



  it("Debe activar el botón Exportar cuando se seleccionan fechas válidas", () => {
    cy.get('[data-testid="date-from"]').type("2025-01-01");
    cy.get('[data-testid="date-to"]').type("2025-05-21");
    cy.contains("Exportar").should("not.be.disabled").click();
  });

  it("Debe mostrar los filtros correctamente en la interfaz", () => {
    cy.get('[data-testid="date-from"]').should("exist").and("be.visible");
    cy.get('[data-testid="date-to"]').should("exist").and("be.visible");
    cy.contains("Exportar").should("exist").and("be.visible");
    cy.contains(/Clientes/i).should("be.visible");
  });
});
