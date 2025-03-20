describe('Lista de empleados', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD")
    };

    beforeEach(() => {
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(20000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard/employee');
        cy.url().should('include', '/dashboard/employee');
        cy.wait(5000);
    });

    it('Debe mostrar correctamente los datos de los empleados', () => {
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('td').eq(0).should('not.be.empty'); // Nombre
                cy.get('td').eq(1).should('contain', '@'); // Email
                cy.get('td').eq(2).should('not.be.empty'); // RUC
                cy.get('td').eq(3).should('not.be.empty'); // Cantidad de mascotas
                cy.get('td').eq(4).should('not.be.empty'); // Actividad reciente
            });
        });
    });


    it('Debe buscar empleados correctamente filtrandolos por nombre', () => {
        cy.get('input[placeholder="Buscar un empleado..."]').type('Nick Jonson');
        cy.get('button').contains('Buscar').click();
        cy.wait(20000);
        cy.get('table tbody tr').should('contain', 'Nick Jonson');
    });

    it('Debe abrir la página de registro de empleados', () => {
        cy.get('button').contains('Agregar').click();
        cy.wait(10000);
        cy.url().should('include', '/dashboard/employee/register');
    });

    it('Debe verificar la paginación', () => {
        cy.get('td').its('length').then((length) => {
            if (length > 10) {
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

