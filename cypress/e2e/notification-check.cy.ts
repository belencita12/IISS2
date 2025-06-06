describe("Pantalla de Notificaciones Admin", () => {
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
        cy.visit("/dashboard/notifications");
        cy.wait(3000);
    });

    it("Acceder a notificaciones", () => {
        cy.visit("/dashboard");
        cy.wait(4000);
        cy.visit("/dashboard/notifications");
        cy.wait(3000);
    });

    it("Filtrado de notificaciones", () => {
        cy.visit("/dashboard");
        cy.wait(4000);
        cy.visit("/dashboard/notifications");
        cy.wait(3000);
    });

    it("Marcar como Leido", () => {
        cy.visit("/dashboard");
        cy.wait(4000);
        cy.visit("/dashboard/notifications");
        cy.wait(3000);
    });
});
