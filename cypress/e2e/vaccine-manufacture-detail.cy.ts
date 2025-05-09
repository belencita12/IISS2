describe('Listado de fabricantes de vacunas', () => {
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
            cy.wait(20000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('dashboard/vaccine/manufacturer');
        cy.url().should('include', 'dashboard/vaccine/manufacturer');
    });

    it('Debe mostrar correctamente los datos de los fabricantes de vacunas', () => {
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('td').eq(0).should('not.be.empty'); 
                cy.get('td').eq(1).should('not.be.empty'); 
            });
        });
    });
    it('Debe abrir la vista de detalles de un fabricante de vacunas', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.get('button[aria-label="Ver detalles"]').click();
        });
        cy.wait(10000);
        cy.url().should('include', '/dashboard/vaccine/manufacturer/9');
        cy.get('h1.text-3xl').should('contain.text', 'Fabricante: ');
    });

});
