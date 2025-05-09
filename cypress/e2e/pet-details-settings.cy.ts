describe('Gestión de Mascotas - Filtros y acciones', () => {
    const SESSION_KEY = 'sessionToken';
    const USER = {
        email: Cypress.env('USER_EMAIL_A'),
        password: Cypress.env('USER_PASSWORD_A'),
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(3000);
        });
        cy.visit('/dashboard/settings/pets');
        cy.url().should('include', '/dashboard/settings/pets');
        cy.wait(3000);
    });

    it('Debe mostrar la lista de mascotas', () => {
        cy.contains('h1', 'Lista de Mascotas').should('be.visible');
        cy.wait(10000);
    });

    
    it('filtrar por nombre "Rufo"', () => {
        cy.contains('h1', 'Lista de Mascotas').should('be.visible');
        cy.wait(10000);
         cy.get('input[placeholder*="Buscar por nombre de la mascota..."]')
            .should('be.visible')
            .type('Rufo');

        cy.wait(20000);
        cy.get('table tbody tr').should('contain', 'Rufo');
    });


    it('Debe navegar al detalle de "Rufo"', () => {
        cy.get('input[placeholder*="Buscar por nombre de la mascota..."]')
            .should('be.visible')
            .type('Rufo');


        cy.wait(20000);
        cy.get('table tbody tr').contains('td', 'Rufo').parents('tr').within(() => {
            cy.get('button').eq(0).click();
        });

        // Validar redirección a detalle
        cy.url().should('match', /\/dashboard\/clients\/\d+\/pet\/\d+$/);
    });

    it('Debe navegar a la edición de "Rufo"', () => {
        cy.get('input[placeholder*="Buscar por nombre de la mascota..."]')
            .should('be.visible')
            .type('Rufo');

        cy.wait(2000);
        cy.get('table tbody tr').contains('td', 'Rufo').parents('tr').within(() => {
            // Segundo botón: Editar (ícono lápiz)
            cy.get('button').eq(1).click();
        });

        // Validar redirección a edición
        cy.url().should('match', /\/dashboard\/clients\/\d+\/pet\/\d+\/edit$/);
    });
});
