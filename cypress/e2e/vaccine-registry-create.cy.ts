describe("Registro de Vacunación - Admin", () => {
  const SESSION_KEY = "adminSession";
  const USER = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
  });

  it("Debe registrar correctamente a Patroclo con vacuna Ueno black", () => {
    cy.visit("/dashboard/settings/vaccine-registry/new");

    // Buscar y seleccionar "Patroclo"
    cy.contains("label", "Mascota")
      .parent()
      .find("input")
      .type("patroclo", { delay: 100 });

    cy.wait(1000); // Esperar que cargue resultados

    cy.get(".hover\\:bg-gray-100").contains(/Patroclo/i).click();

    // Buscar y seleccionar vacuna "Ueno"
    cy.contains("label", "Vacuna")
      .parent()
      .find("input")
      .type("Ueno", { delay: 100 });

    cy.wait(1000); // Esperar que cargue resultados

    cy.get(".hover\\:bg-gray-100").contains(/Ueno black/i).click();

    // Dosis
    cy.get('input[name="dose"]').type("1");

    // Fechas válidas (hoy y 2 días después)
    const now = new Date();
    const future = new Date(now.getTime() + 2 * 86400000);
    const format = (d: Date) => d.toISOString().slice(0, 16);

    cy.get('input[type="datetime-local"]').eq(0).type(format(now));
    cy.get('input[type="datetime-local"]').eq(1).type(format(future));

    // Interceptar y enviar
    cy.intercept("POST", "**/vaccine-registry").as("createRegistry");
    cy.contains("button", "Registrar").click();

    cy.wait("@createRegistry").its("response.statusCode").should("eq", 201);
    cy.url().should("include", "/dashboard/clients/");
  });
});
