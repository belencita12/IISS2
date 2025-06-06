describe('Ver lista de especies eliminadas - Admin', () => {
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
        cy.visit('/dashboard/settings/species');
        cy.url().should('include', '/dashboard/settings/species');
        cy.wait(2000);
    });

    it('debe mostrar una lista de especies eliminadas al presionar "Ver eliminados"', () => {
        cy.get('button').contains('Ver eliminados').click();
        cy.wait(4000);
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
    });
});