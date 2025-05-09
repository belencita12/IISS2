describe('Historial de Vacunación - Vista administrativa', () => {
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
        });
        cy.visit('/dashboard/settings/vaccine-registry');
        cy.url().should('include', '/dashboard/settings/vaccine-registry');
    });

    it('Debe mostrar el listado de "Historial de vacunación"', () => {
        cy.contains('Historial de vacunación').should('be.visible');
        cy.get('table').should('exist');
    });

    it('Debe permitir ver detalles de un registro de vacunación', () => {
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.get(':nth-child(2) > .text-right > [aria-label="Ver"]').first().click();
        cy.wait(10000)
        cy.url().should('match', /\/dashboard\/settings\/vaccine-registry\/\d+$/);
    });

    it('Debe permitir editar un registro de vacunación', () => {
        cy.get('table tbody tr').should('have.length.greaterThan', 0);

        cy.get(':nth-child(2) > .text-right > [aria-label="Editar"]').first().click();
        cy.wait(30000)
        cy.url().should('match', /\/dashboard\/(clients\/\d+\/pet\/\d+\/\d+|settings\/vaccine-registry\/\d+\/edit)$/);
    });
});
