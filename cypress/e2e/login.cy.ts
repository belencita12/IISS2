describe("Inicio de sesión", () => {
  const DELAY = { delay: 100 };
  const email = Cypress.env("USER_EMAIL");
  const password = Cypress.env("USER_PASSWORD");

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/login");
    cy.url().should("include", "/login");
  });

  it("Debe mostrar un error si el campo 'email' está vacío", () => {
    cy.get("input[name='password']").type("tester", DELAY);
    cy.get("form").submit();
    cy.contains("Credenciales incorrectas. Inténtalo de nuevo.").should("be.visible");
  });

  it("Debe mostrar un error si el campo 'password' está vacío", () => {
    cy.get("input[name='email']").type("test@gmail.com", DELAY);
    cy.get("form").submit();
    cy.contains("Credenciales incorrectas. Inténtalo de nuevo.").should("be.visible");
  });

  it("Debe mostrar un error si el correo tiene un formato inválido", () => {
    cy.get("input[name='email']").type("test.com", DELAY);
    cy.get("form").submit();
    cy.contains("introduce un email válido").should("be.visible");
  });

  it("Debe mostrar error si las credenciales son incorrectas", () => {
    cy.get("input[name='email']").type("incorrecto@gmail.com", DELAY);
    cy.get("input[name='password']").type("malaClave123", DELAY);
    cy.get("form").submit();
    cy.contains("Credenciales incorrectas").should("be.visible");
  });

  it("Debe iniciar sesión correctamente con credenciales válidas", () => {
    cy.get("input[name='email']").type(email, DELAY);
    cy.get("input[name='password']").type(password, DELAY);
    cy.get("form").submit();
    cy.location("pathname").should("eq", "/user-profile");
  });
});
