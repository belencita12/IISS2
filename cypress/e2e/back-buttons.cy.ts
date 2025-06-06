describe("Verificar botón Volver en pantallas clave", () => {
  const sessions: Record<string, string> = {
    admin: "adminSession",
    cliente: "clientSession",
  };

  const pagesToTest = [
    { path: "/user-profile/pet/list-pets", type: "cliente" },
    { path: "/user-profile/pet/27", type: "cliente" },
    { path: "/user-profile/appointment/133", type: "cliente" },
    { path: "/dashboard/clients/14", type: "admin" },
    { path: "/dashboard/clients/14/pet/27", type: "admin" },
    { path: "/dashboard/products/143", type: "admin" },
    { path: "/dashboard/stock/4", type: "admin" },
    { path: "/dashboard/movement/22", type: "admin" },
    { path: "/dashboard/purchases/15", type: "admin" },
    { path: "/dashboard/employee/6", type: "admin" },
    { path: "/dashboard/invoices/51", type: "admin" },
    { path: "/dashboard/settings/positions/2", type: "admin" },
  ] as const;

  type PageType = (typeof pagesToTest)[number]["type"];

  const credentials: Record<PageType, { email: string; password: string }> = {
    admin: {
      email: Cypress.env("USER_EMAIL_A"),
      password: Cypress.env("USER_PASSWORD_A"),
    },
    cliente: {
      email: Cypress.env("USER_EMAIL"),
      password: Cypress.env("USER_PASSWORD"),
    },
  };

  pagesToTest.forEach(({ path, type }) => {
    it(`Debe mostrar y funcionar el botón Volver en ${path}`, () => {
      const sessionKey = sessions[type];
      const user = credentials[type];

      cy.session(sessionKey, () => {
        cy.loginAndSetSession(sessionKey, user.email, user.password);
      });

      cy.visit(path);

      cy.contains("Volver")
        .should("be.visible")
        .click();

      cy.url().should("not.include", path);
    });
  });
});
