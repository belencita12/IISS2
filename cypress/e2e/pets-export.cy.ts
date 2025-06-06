describe("Reporte de mascotas - Admin", () => {
  const SESSION_KEY = "adminSession";
  const USER = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/dashboard/settings/pets");
  });

  it("Debe generar un PDF correctamente con especie y fechas válidas", () => {
    // === Selección de especie desde componente Select ===
    cy.contains("label", "Especie")
      .parent()
      .within(() => {
        cy.get('[role="combobox"]').click(); // Abre el dropdown
      });

    // Seleccionar primera especie real (salteando "Todas")
    cy.get('[role="option"]').not('[data-value="ALL"]').first().click();

    // === Fechas válidas ===
    cy.get('input[type="date"]#from').type("2025-05-01");
    cy.get('input[type="date"]#to').type("2025-05-21");

    // Interceptar PDF
    cy.intercept("GET", "**/pet/report**").as("getPetReport");

    // Generar
    cy.contains("button", "Exportar").click();
    cy.wait("@getPetReport").its("response.statusCode").should("eq", 200);
  });

  it("Debe mostrar filtros de especie y fechas correctamente", () => {
    cy.contains("label", "Especie").should("exist").and("be.visible");
    cy.get('input[type="date"]#from').should("exist").and("be.visible");
    cy.get('input[type="date"]#to').should("exist").and("be.visible");
    cy.contains("button", "Exportar").should("exist").and("be.visible");
  });

  it("Debe activar el botón Exportar con filtros cargados", () => {
    cy.contains("label", "Especie")
      .parent()
      .within(() => {
        cy.get('[role="combobox"]').click();
      });
    cy.get('[role="option"]').not('[data-value="ALL"]').first().click();

    cy.get('input[type="date"]#from').type("2025-05-01");
    cy.get('input[type="date"]#to').type("2025-05-21");

    cy.contains("button", "Exportar").should("not.be.disabled").click();
  });
});
