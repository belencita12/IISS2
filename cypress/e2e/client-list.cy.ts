describe('ClientListSection', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email:  Cypress.env("USER_EMAIL_A"),
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
        cy.visit('/dashboard/clients');
        cy.url().should('include', '/dashboard/clients');
        cy.wait(5000);
    });

    it('Debe mostrar correctamente los datos de los clientes', () => {
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('td').eq(0).should('not.be.empty'); // Nombre
                cy.get('td').eq(1).should('contain', '@'); // Email
                cy.get('td').eq(2).should('not.be.empty'); // Cantidad de mascotas
                cy.get('td').eq(3).should('not.be.empty'); // Actividad reciente
            });
        });
    });


    it('Debe buscar clientes correctamente filtrandolos por nombre', () => {
        cy.get('input[placeholder="Buscar por nombre, correo o ruc"]').type('Juan');
        
        cy.wait(5000);
        cy.get('table tbody tr').should('contain', 'Juan Pérez');
    });


    it('Debe buscar clientes correctamente filtrando por correo', () => {
        cy.get('input[placeholder="Buscar por nombre, correo o ruc"]').type('anniamicaela@gmail.com');
        
        cy.wait(5000);
        cy.get('table tbody tr').should('contain', 'anniamicaela@gmail.com');
    });


    it('Debe abrir la página de registro de clientes', () => {
        cy.get('button').contains('Agregar').click();
        cy.wait(5000);
        cy.url().should('include', '/dashboard/clients/register');
    });
    
    it('Debe hacer clic en el icono de ojo', () => {
        cy.get('.lucide-eye').first().click();
        cy.wait(5000);
        cy.url().should('include', '/dashboard/clients/');
    });

   it('Debe verificar la paginación usando íconos SVG', () => {
  // Ir a la última página
  cy.get('a svg.lucide-chevrons-right').parent().click();
  cy.wait(1000);
  cy.get('table tbody tr').should('exist');

  // Ir a la página anterior
  cy.get('a svg.lucide-chevron-left').parent().click();
  cy.wait(1000);
  cy.get('table tbody tr').should('exist');

  // Ir a la primera página
  cy.get('a svg.lucide-chevrons-left').parent().click();
  cy.wait(1000);
  cy.get('table tbody tr').should('exist');

  // Ir a la página siguiente
  cy.get('a svg.lucide-chevron-right').parent().click();
  cy.wait(1000);
  cy.get('table tbody tr').should('exist');
});



    
});
