describe("Informacion y Videos en /help", () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A"),
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.url().should("include", "/dashboard");
        });

        cy.visit("/dashboard");
        cy.wait(5000);
        cy.visit("/dashboard/help");
        cy.wait(3000);
    });

    it("ver Dashboard", () => {
        cy.visit("/dashboard");
        cy.wait(4000);
        cy.visit("/dashboard/help");
        cy.wait(3000);
    });

    it("ver Clientes y Citas", () => {
        cy.visit("/dashboard");
        cy.wait(4000);
        cy.visit("/dashboard/help");
        cy.wait(3000);
    });

    it("ver Inventario", () => {
        cy.visit("/dashboard");
        cy.wait(4000);
        cy.visit("/dashboard/help");
        cy.wait(3000);
    });

    it("ver Finanzas", () => {
        cy.visit("/dashboard");
        cy.wait(4000);
        cy.visit("/dashboard/help");
        cy.wait(3000);
    });
});
