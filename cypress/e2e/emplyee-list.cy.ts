describe('Lista de empleados', () => {
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
        cy.get('.relative > .flex').type('Gustavo Cerati');
        cy.wait(5000);
        cy.get('table tbody tr').should('contain', 'Gustavo Cerati');
    });

    it('Debe abrir la página de registro de empleados', () => {
        cy.get('button').contains('Agregar').click();
        cy.wait(5000);
        cy.url().should('include', '/dashboard/employee/register');
    });

    it('Debe verificar la paginación', () => {

        cy.get('body').then(($body) => {
            if ($body.find('span:contains("Next")').length > 0) {
              // Simular hacer clic en el botón de paginación "Siguiente"
              cy.get('span:contains("Next")').click();
              //  Verificar que el paginador se actualizó a página 2
              cy.get('a[aria-current="page"]').should('contain', '2');
            } else {
              cy.log('No existe la paginacion');
            }
          });

    });

    
});

