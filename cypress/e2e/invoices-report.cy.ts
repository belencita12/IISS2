describe('Reporte de Facturas - Admin', () => {
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
        cy.visit('/dashboard/invoices');
        cy.url().should('include', '/dashboard/invoices');
        cy.wait(2000);
    });

    it('debe mostrar un toast de error si no se selecciona el rango de fechas y se intenta exportar', () => {
        cy.get('button').contains('Exportar').click();
    });

    it('debe generar un PDF correctamente al elegir un rango de fechas válido', () => {
        cy.get('#startDate').type('2024-05-01');
        cy.get('#endDate').type('2024-05-20');
        cy.wait(6000);
        cy.get('button').contains('Exportar').click();
    });
});