describe("Acceso restringido al dashboard para cliente", () => {
    const SESSION_KEY = "clientSessionToken";
    const USER_CLIENTE = {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD"),
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER_CLIENTE.email, USER_CLIENTE.password);
            cy.url().should("include", "/user-profile");
        });

        cy.visit("/user-profile");
        cy.wait(2000);
    });

    it("Debe bloquear acceso al dashboard y mostrar error 401", () => {
        cy.visit("/dashboard");
        cy.contains("401").should("be.visible");
        cy.contains("Acceso no autorizado", { matchCase: false }).should("be.visible");
    });
});
