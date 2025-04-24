describe('Detalle de la Factura', () => {
    const SESSION_KEY = "sessionToken";;

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        const sessionToken: string = Cypress.env(SESSION_KEY);
        if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);
    });

    it('login', () => {

        // establecer sesión
        const USER = {
            email: Cypress.env("USER_EMAIL_A"),
            password: Cypress.env("USER_PASSWORD_A")
        };

        cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);

    })

    it('Debe mostrar el detalle de la factura con ID 45', () => {

        cy.visit('/dashboard/invoices/45', { timeout: 20000 });
        cy.url().should('include', '/dashboard/invoices/45');
        cy.get("div.animate-pulse", { timeout: 20000 }).should("not.exist");
        cy.contains("Factura Nº", { timeout: 10000 });

    });
});