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


    it('Debe buscar fabricantes de vacunas correctamente filtrandolos por nombre', () => {
        cy.get('input[placeholder="Buscar por nombre..."]').type('Merial');
        cy.wait(5000);
        cy.get('table tbody tr').should('contain', 'Merial');
    });

    it('Debe abrir la página de registro de fabricantes de vacunas', () => {
        cy.wait(5000);
        cy.get('button').contains('Agregar').click();
        cy.wait(5000);
    });
    it('Debe crear, editar y luego eliminar un fabricante de vacunas', () => {
        const nombreOriginal = `TestFabricante-${Date.now()}`;
        const nombreEditado = `Editado-${Date.now()}`;
       
        cy.visit('dashboard/vaccine/manufacturer/new');
        cy.get('input[name="name"]').type(nombreOriginal);
        cy.get('button[type="submit"]').contains('Crear').click();
        cy.wait(10000);
        cy.url().should('include', '/dashboard/vaccine/manufacturer');
        cy.contains('table tbody tr', nombreOriginal).should('exist');

        cy.contains('table tbody tr', nombreOriginal).within(() => {
            cy.get('button[aria-label="Editar"]').click();
        });
        cy.wait(10000);
        cy.get('input[name="name"]').clear().type(nombreEditado);
        cy.get('button[type="submit"]').contains('Actualizar').click();
        cy.url().should('include', '/dashboard/vaccine/manufacturer');
        cy.contains('table tbody tr', nombreEditado).should('exist');

        cy.contains('table tbody tr', nombreEditado).within(() => {
            cy.get('button[aria-label="Eliminar"]').click();
        });
        cy.contains('button', 'Eliminar').click();
        cy.wait(10000);
        cy.contains('table tbody tr', nombreEditado).should('not.exist');
    });
});
