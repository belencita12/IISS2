describe('Listado de vacunas', () => {
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
        cy.visit('/dashboard/vaccine');
        cy.url().should('include', '/dashboard/vaccine');
        cy.wait(5000);
    });

    it('Debe mostrar correctamente la lista de vacunas', () => {
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('td').eq(0).should('not.be.empty'); // Nombre
                cy.get('td').eq(1).should('not.be.empty'); // Fabricante
                cy.get('td').eq(2).should('not.be.empty'); // Especie
                cy.get('td').eq(3).should('not.be.empty'); // Acciones
            });
        });
    });

 /*    it('Debe buscar vacunas correctamente filtrandolos por nombre', () => {
        cy.get('input[placeholder="Buscar por nombre o productor..."]').type('Vacuna X');
        cy.get('button').contains('Buscar').click();
        cy.wait(5000);
        cy.get('table tbody tr').should('contain', 'Vacuna X');
    });

    it('Debe buscar vacunas correctamente filtrandolos por fabricante', () => {
        cy.get('input[placeholder="Buscar por nombre o productor..."]').type('Vacuna X');
        cy.get('button').contains('Buscar').click();
        cy.wait(5000);
        cy.get('table tbody tr').should('contain', 'Vacuna X');
    }); */

  /*   it('Debe verificar la paginación', () => {
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
    }); */
});
