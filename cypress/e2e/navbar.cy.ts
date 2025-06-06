describe("Navbar", () => {
  const TIMEOUT = { timeout: 15000 };

  const SESSION_KEY = "clientSession";
  const USER = {
    email: Cypress.env("USER_EMAIL"),
    password: Cypress.env("USER_PASSWORD"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/user-profile");
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

  it("Navegar por los enlaces del navbar cuando no estás autenticado y cerrar sesión", () => {
    cy.visit("/user-profile");
    
    cy.get("button").contains("Cerrar sesión").click();
    cy.wait(3000);

    const links = [
      { label: "Inicio", path: "/home" },
      //{ label: "Mi Perfil", path: "/user-profile" },
      { label: "Nosotros", path: "/about" },
      { label: "Servicios", path: "/services" },
      { label: "Tienda", path: "/shop" },
    ];

    links.forEach((link) => {
      cy.contains(link.label).click();
      cy.location("pathname").should("include", link.path);
    });

    //cy.contains("Cerrar sesión").click();
  });
});
