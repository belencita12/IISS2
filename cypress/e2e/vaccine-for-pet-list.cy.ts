describe('Listado de vacunas aplicadas por mascotas', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD")
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(20000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard/clients/2/pet/1');
        cy.url().should('include', '/dashboard/clients/2/pet/1');
    });

    it('Debe mostrar correctamente las vacunas aplicadas a la mascota', () => {
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('td').eq(0).should('not.be.empty'); // Fecha
                cy.get('td').eq(1).should('not.be.empty'); // Detalle de la vacuna
                cy.get('td').eq(2).should('not.be.empty'); // Fecha prevista
                cy.get('td').eq(3).should('not.be.empty'); // Dosis
                cy.get('td').eq(4).should('not.be.empty'); // Recordatorio
            });
        });
    });

    it('Debe verificar la paginación', () => {
        cy.get('td').its('length').then((length) => {
            if (length > 16) {
                cy.contains('span', 'Next').click();
                cy.wait(5000);
                cy.get('table tbody tr').should('exist');

                cy.contains('span', 'Previous').click();
                cy.wait(5000);
                cy.get('table tbody tr').should('exist');

                cy.wait(5000);
                cy.get('a').contains('2').click();
                cy.wait(5000);
                cy.get('table tbody tr').should('exist');

                cy.wait(5000);
                cy.get('a').contains('1').click();
                cy.wait(5000);
                cy.get('table tbody tr').should('exist');
            }
        });
    });
});
