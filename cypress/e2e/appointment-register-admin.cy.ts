describe("Registro de Cita", () => {
  const SESSION_KEY = "sessionToken";
  const USER = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A"),
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/dashboard/appointment/register");
    cy.url().should("include", "/dashboard/appointment/register");
  });

  it("Debe registrar una cita correctamente", () => {
    // Buscar mascota
    cy.get('input[placeholder="Buscar por nombre..."]').first().type("Coni");
    cy.contains("Coni").should("exist").click(); // o el nombre que devuelva

    // Buscar empleado
    cy.get('input[placeholder="Buscar por nombre..."]').eq(1).type("Agus");
    cy.contains("Agus").should("exist").click();

    // Seleccionar servicio
    /*cy.get('[class*="SelectTrigger"]').first().click();
    cy.get('[class*="SelectContent"]')
      .contains("Consulta")
      .should("exist")
      .click();*/

      // Espera explícita al render del trigger
    cy.contains("Debes seleccionar al menos un servicio")
    .should("be.visible")
    .click(); // Esto abre el dropdown

    // Luego selecciona 'Consulta' del dropdown
    cy.contains('[role="option"]', 'Consulta')
    .should("exist")
    .click();


    // Seleccionar fecha
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    const dateStr = tomorrow.toISOString().split("T")[0];
    cy.get('input[type="date"]').type(dateStr);

    // Esperar disponibilidad horaria
    cy.contains("Seleccionar horario de la cita", { timeout: 10000 }).should("exist");
    cy.get("button")
      .contains(/^\d{2}:\d{2}$/) // cualquier botón con formato de hora
      .first()
      .click();

    // Ingresar detalles opcionales
    cy.get("textarea").type("Cita de prueba automática.");

    // Click en "Agendar"
    cy.get("button")
      .contains(/Agendar/i)
      .should("not.be.disabled")
      .click();

    // Confirmación y redirección
    cy.url({ timeout: 10000 }).should("include", "/dashboard/appointment");
  });
});
