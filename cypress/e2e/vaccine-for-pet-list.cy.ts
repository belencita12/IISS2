describe('Listado de vacunas aplicadas por mascotas', () => {
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
            cy.wait(10000);
            cy.url().should('include', '/dashboard');
        });
      cy.visit('/dashboard');
      cy.contains('p', "Clientes").click();
      cy.wait(3000);
      cy.get('.text-3xl').should('contain', 'Clientes');
      cy.wait(3000);
      cy.contains('td', 'Seraphina ').parent().find('[aria-label="Ver detalles"]').click();
      cy.wait(5000);
        
    });

    it('Debe mostrar correctamente las vacunas aplicadas a la mascota', () => {
        cy.get(':nth-child(1) > .text-right > [aria-label="Detalles"]').first().click();
        cy.wait(10000);
        cy.get('body').then(($body) => {
            if ($body.find('table tbody tr').length > 0) {
                // Hay filas en la tabla → validar las vacunas
                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td').eq(0).should('not.be.empty'); // Fecha
                        cy.get('td').eq(1).should('not.be.empty'); // Detalle de la vacuna
                        cy.get('td').eq(2).should('not.be.empty'); // Fecha prevista
                        cy.get('td').eq(3).should('not.be.empty'); // Dosis
                        cy.get('td').eq(4).should('not.be.empty'); // Recordatorio
                    });
                });
            } else {
                // No hay filas → debe mostrar el mensaje "No hay vacunas registradas"
                cy.contains('No hay vacunas registradas').should('be.visible');
            }
        });
    });

   
});
