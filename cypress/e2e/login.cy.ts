describe("Inicio de sesión", () => {
  const DELAY = { delay: 100 };

  let testUser: BaseUser;

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept("POST", "**/auth/signup").as("register");
    cy.generateUser().then((user) => {
      testUser = user;
      cy.log("Registrando usuario de prueba...");
      cy.register(user);
      cy.wait("@register", { timeout: 16000 });
    });
  });

  beforeEach(() => {
    cy.clearCookies();
   cy.clearLocalStorage();
    cy.visit("/login");
    cy.url().should("include", "/login");
  });

  it("Debe mostrar un error si el campo 'email' está vacío", () => {
    cy.get("input[name='password']").type("tester", DELAY);
    cy.contains("Iniciar Sesión").click();
    cy.get("body").click();
    cy.contains(
      "Por favor, introduce un email válido. Ej: juanperez@gmail.com"
    ).should("be.visible");
  });

  it("Debe mostrar un error si el campo 'password' está vacío", () => {
    cy.get("input[name='email']").type("test@gmail.com", DELAY);
    cy.contains("Iniciar Sesión").click();
    cy.get("body").click();
    cy.contains("Por favor, introduce una contraseña válida").should(
      "be.visible"
    );
  });

  it("Debe mostrar un error si el correo tiene un formato inválido", () => {
    cy.get("input[name='email']").type("test.com", DELAY);
    cy.contains("Iniciar Sesión").click();
    cy.get("body").click();
    cy.contains(
      "Por favor, introduce un email válido. Ej: juanperez@gmail.com"
    ).should("be.visible");
    cy.get("input[name='password']").type("123", DELAY);
  });

  it("Debe mostrar error si las credenciales son incorrectas", () => {
    cy.get("input[name='email']").type("ian@gmail.com", DELAY);
    cy.get("input[name='password']").type("ian123", DELAY);
    cy.get("form").submit();
    cy.contains("Credenciales incorrectas. Inténtalo de nuevo.").should(
      "be.visible"
    );
    cy.wait(2000);
  });

  it("Debe iniciar sesión correctamente con credenciales válidas", () => {
    expect(testUser).to.exist;
    cy.get("input[name='email']").type(testUser.email, DELAY);
    cy.get("input[name='password']").type(testUser.password, DELAY);
    cy.get("form").submit();
    cy.location("pathname", { timeout: 10000 }).should("eq", "/user-profile");
    cy.wait(2000);
  });
});
