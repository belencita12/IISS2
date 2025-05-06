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
                cy.get('td').eq(0).should('not.be.empty'); // Nombre
                cy.get('td').eq(1).should('not.be.empty'); // Acciones
            });
        });
    });


    it('Debe buscar fabricantes de vacunas correctamente filtrandolos por nombre', () => {
        cy.get('input[placeholder="Buscar por nombre..."]').type('Nico Pets THE ORIGIN LABS');
        cy.wait(5000);
        cy.get('table tbody tr').should('contain', 'Nico Pets THE ORIGIN LABS');
    });

    it('Debe abrir la página de registro de fabricantes de vacunas', () => {
        cy.wait(5000);
        cy.get('button').contains('Agregar').click();
        cy.wait(5000);
        cy.visit('dashboard/vaccine/manufacturer');
    });


});
