describe('Perfil de Usuario', () => {
  
    it('Muestra la información del perfil y mascotas cuando el usuario está autenticado', () => {
      cy.intercept('GET', '**/user-profile*').as('getUserProfile'); //intercepto las peticiones
      cy.intercept('GET', '**/pet*').as('getPets');
      
      cy.log('Iniciando sesión con un usuario válido');
      cy.visit('/login');  
      cy.get('input[name="email"]').type('test1@gmail.com'); 
      cy.get('input[name="password"]').type('lourdes123');  
      cy.get('button[type="submit"]').click();  
      
      cy.log('Esperando la respuesta de perfil y mascotas');
      cy.wait('@getUserProfile');
      cy.wait('@getPets', { timeout: 20000 });
    
      cy.log('Verificando que la información del perfil y las mascotas se muestre correctamente');
      cy.get('h2.text-xl.font-bold.mt-2').should('contain.text', 'Lourdes Valenzuela');  
      cy.contains('Tus Mascotas Registradas').should('be.visible');  
      cy.url().should('include', '/user-profile');  

      cy.log('Verificando la navegación hacia la página de agregar mascota');
      cy.contains('button', 'Agregar Mascota').click();
      cy.url().should('include', '/pet/register'); 
      cy.go('back');  
      
      cy.log('Verificando la navegación hacia la lista de mascotas');
      cy.contains('a', 'Ver mi lista de mascotas').click();
      cy.url().should('include', '/list-pets');  
      cy.go('back'); 
      
      cy.log('Verificando las tarjetas de mascotas');
      cy.get('section').then(($section) => {
        if ($section.text().includes('No tienes mascotas registradas.')) {
          cy.contains('No tienes mascotas registradas.').should('be.visible');
        } else {
          cy.get('a[href*="/detalle-mascota/"]', { timeout: 30000 })
            .should('have.length.greaterThan', 0)  // Aseguro de que haya al menos una tarjeta
            .first()  
            .click();  
          cy.url().should('include', '/detalle-mascota/');
        }
      });
    });
  });
  