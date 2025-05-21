describe('Ver lista de razas eliminadas - Admin', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A")
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(5000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard/settings/races');
        cy.url().should('include', '/dashboard/settings/races');
        cy.wait(2000);
    });

    it('debe mostrar una lista de razas eliminadas al presionar "Ver eliminados"', () => {
        cy.get('button').contains('Ver eliminados').click();
        cy.wait(4000);
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
    });
});