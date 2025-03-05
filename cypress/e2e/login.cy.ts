describe("Inicio de sesión", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.url().should("include", "/login");
  });

  it("Debe mostrar un error si el campo 'email' está vacío", () => {
    cy.get("input[name='password']").type("lourdes", { delay: 100 });
    cy.contains("Iniciar Sesión").click();
    cy.get("body").click();
    cy.contains("Por favor, introduce un email válido. Ej: juanperez@gmail.com").should("be.visible");
  });

  it("Debe mostrar un error si el campo 'password' está vacío", () => {
    cy.get("input[name='email']").type("lourdes@gmail.com", { delay: 100 });
    cy.contains("Iniciar Sesión").click();
    cy.get("body").click();
    cy.contains("Por favor, introduce una contraseña válida").should("be.visible");
  });

  it("Debe mostrar un error si el correo tiene un formato inválido", () => {
    cy.get("input[name='email']").type("lourdes.com", { delay: 100 });
    cy.contains("Iniciar Sesión").click();
    cy.get("body").click();
    cy.contains("Por favor, introduce un email válido. Ej: juanperez@gmail.com").should("be.visible");
    cy.get("input[name='password']").type("123", { delay: 100 });
  });

  it("Debe mostrar error si las credenciales son incorrectas", () => {
    cy.get("input[name='email']").type("ian@gmail.com", { delay: 100 });
    cy.get("input[name='password']").type("ian123", { delay: 100 });
    cy.get("form").submit();
    cy.contains("Credenciales incorrectas. Inténtalo de nuevo.").should("be.visible");
    cy.wait(2000);
  });

  it("Debe iniciar sesión correctamente con credenciales válidas", () => {
    cy.get("input[name='email']").type("edith@gmail.com", { delay: 100 });
    cy.get("input[name='password']").type("lourdes123", { delay: 100 });
    cy.get("form").submit();
    cy.location("pathname", { timeout: 10000 }).should("eq", "/user-profile");
    cy.wait(2000);
  });
});