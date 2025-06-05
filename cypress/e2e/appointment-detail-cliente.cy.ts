describe("Detalle de cita (cliente)", () => {
  const SESSION_KEY = "clientSession";
  const USER = {
    email: Cypress.env("USER_EMAIL"),
    password: Cypress.env("USER_PASSWORD"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/user-profile/appointment/122"); // usa un ID válido que tenga datos reales
  });

  it("Debe mostrar todos los servicios contratados", () => {
  cy.contains(/Servicio[s]?/i).should("exist");

  cy.get("ul").first().within(() => {
    cy.get("li").should("have.length.at.least", 1);
  });

  // ✅ Valida que el primer <li> tenga algún texto
  cy.get("ul li").first().invoke("text").should("not.be.empty");
});


  it("Debe tener colores y clases de diseño consistentes", () => {
    // Encabezado principal
    cy.get("h2")
      .should("have.class", "text-3xl")
      .and("have.class", "font-bold")
      .and("have.class", "text-myPurple-focus");

    // Validar badge de estado
    cy.get("span")
      .contains(/Pendiente|Finalizada|Cancelada/i)
      .should("have.class", "bg-myPink-primary")
      .and("have.class", "text-white")
      .and("have.class", "rounded-full");

    // Validar colores de detalles
    cy.get("div").should("have.class", "bg-white");
  });

 
});
