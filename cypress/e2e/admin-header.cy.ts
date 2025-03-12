describe('Admin Panel Header E2E', () => {
    it('should display the correct header after visiting the admin panel', () => {
      // Visita el panel de administración
     // cy.visit('/admin');
  
      // Comprueba que el header se muestre
      cy.get('header').within(() => {
        cy.contains('Bienvenido al panel de administración').should('exist');
        cy.get('h2').should('contain.text', 'Juan Pérez'); // Cambia según el usuario 
      });
  
      // Opcional: verifica la imagen de avatar
      cy.get('header img')
        .should('have.attr', 'src')
        .and('include', 'blank-profile-picture');
    });
  });
  