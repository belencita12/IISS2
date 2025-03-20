describe("Perfil de Usuario", () => {
  const waitOptions = { timeout: 30000 };

  it("Muestra la información del perfil y mascotas cuando el usuario está autenticado", () => {
    cy.intercept("GET", "**/user-profile*").as("getUserProfile");
    cy.intercept("GET", "**/pet*").as("getPets");

    let globUser: BaseUser;

    cy.generateUser().then((user) => {
      cy.log("Creando un usuario válido");
      cy.log("User:", JSON.stringify(user));
      cy.register(user);
      globUser = user;
      cy.log("Iniciando sesión con un usuario válido");
      cy.visit("/login");
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('button[type="submit"]').click();
    });

    cy.wait("@getUserProfile", waitOptions);
    cy.wait("@getPets", waitOptions);
    cy.wait(10000);

    cy.then(() => {
      expect(globUser).to.not.be.undefined;
      cy.log("Verificando la información del perfil");

      cy.get("h2.text-xl.font-bold.mt-2", waitOptions).should(
        "contain.text",
        globUser.fullName
      );
      cy.contains("Tus Mascotas Registradas", waitOptions).should("be.visible");
      cy.url(waitOptions).should("include", "/user-profile");

      cy.log("Verificando la navegación hacia la página de agregar mascota");
      cy.contains("button", "Agregar Mascota", waitOptions).click();
      cy.wait(5000);
      cy.url(waitOptions).should("include", "/pet/register");
      cy.go("back");
      cy.wait(10000);

      cy.log("Verificando la navegación hacia la lista de mascotas");
      cy.contains("a", "Ver mi lista de mascotas", waitOptions).click();
      cy.wait(10000);
      cy.url(waitOptions).should("include", "/list-pets");
      cy.go("back");

      cy.log("Verificando las tarjetas de mascotas");
      cy.wait("@getPets", waitOptions);
      cy.get("p.mt-4.text-gray-500", waitOptions);
    });
  });
});
