describe("Detalle de cita (admin)", () => {
  const SESSION_KEY = "adminSession";
  const USER = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/dashboard/appointment/100"); // Usa un ID válido con datos completos
  });

  it("Debe mostrar correctamente el detalle de la cita y tener diseño consistente", () => {
    // Esperar carga y validar URL
    cy.url().should("match", /\/dashboard\/appointment\/\d+$/);

    // === Validar encabezado ===
    cy.contains("Información de la Cita").should("exist");
    cy.contains(/Pendiente|Finalizada|Cancelada/).should("exist");

    // === Validar programación (fecha y hora) ===
    cy.contains("Programación").should("exist");
    cy.contains("Fecha").should("exist");
    cy.contains("Hora").should("exist");

    // === Servicios ===
    cy.contains("Servicios solicitados").should("exist");

    // === Detalles ===
    cy.contains("Detalles").should("exist");

    // === Dueño (cliente) ===
    cy.contains("Datos del Propietario").should("exist");
    cy.contains("Nombre").should("exist");
    cy.contains("Email").should("exist");
    cy.contains("Teléfono").should("exist");
    cy.contains("RUC").should("exist");

    // === Mascota ===
    cy.contains("Datos de la Mascota").should("exist");
    cy.contains("Nombre").should("exist");
    cy.contains("Especie").should("exist");
    cy.contains("Raza").should("exist");
    cy.contains("Edad").should("exist");

    // === Empleado ===
    cy.contains("Empleado Asignado").should("exist");

    // === Botón Volver ===
    cy.contains("Volver")
      .should("be.visible")
      .click();

   
  });
});
