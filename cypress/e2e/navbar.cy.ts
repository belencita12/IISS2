describe("Navbar", () => {
  let testUser: BaseUser;

  before(() => {
    cy.intercept("POST", "**/auth/signup").as("register");
    cy.generateUser().then((user) => {
      testUser = user;
      cy.log("Registrando usuario de prueba...");
      cy.register(user);
      cy.wait("@register", { timeout: 16000 });
    });
  });

  it("Navegar por los enlaces del navbar cuando no estás autenticado", () => {
    cy.visit("/");
    const links = [
      { label: "Inicio", path: "/" },
      { label: "Nosotros", path: "/about" },
      { label: "Servicios", path: "/service" },
      { label: "Tienda", path: "/shop" },
    ];

    links.forEach((link) => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.contains(link.label).click();
      cy.location("pathname").should("include", link.path);
    });
  });

  it("Navegar por los enlaces del navbar cuando estás autenticado y cerrar sesión", () => {
    cy.visit("/login");
    expect(testUser).to.exist;
    cy.get("input[name='email']").type(testUser.email);
    cy.get("input[name='password']").type(testUser.password);
    cy.get("button[type='submit']").click();
    cy.wait(3000);

    const links = [
      { label: "Inicio", path: "/" },
      { label: "Mi Perfil", path: "/user-profile" },
      { label: "Nosotros", path: "/about" },
      { label: "Servicios", path: "/service" },
      { label: "Tienda", path: "/shop" },
    ];

    links.forEach((link) => {
      cy.contains(link.label).click();
      cy.location("pathname").should("include", link.path);
    });

    cy.contains("Cerrar sesión").click();
    cy.location("pathname").should("include", "/");
  });
});
