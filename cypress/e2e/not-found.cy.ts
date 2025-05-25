describe("Pantallas Not Found para IDs inválidos (ADMIN)", () => {
  const sessionKey = "adminSession";

  const credentials = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A"),
  };

  const invalidRoutes = [
    "/dashboard/employee/4343",
    "/dashboard/clients/4343",
  ];

  beforeEach(() => {
    cy.session(sessionKey, () => {
      cy.loginAndSetSession(sessionKey, credentials.email, credentials.password);
    });
  });

  invalidRoutes.forEach((route) => {
    it(`Debe mostrar la página 404 para ${route}`, () => {
      cy.visit(route, { failOnStatusCode: false }); // 🔧 <-- cambio acá

      // Verifica que aparezca algo como "404" o mensaje claro de no encontrado
      cy.contains("404").should("exist");

   
    });
  });
});
