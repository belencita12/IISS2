describe('Perfil de Usuario', () => {
  const waitOptions = { timeout: 30000 };

  it('Muestra la información del perfil y mascotas cuando el usuario está autenticado', () => {
    cy.intercept('GET', '**/user-profile*').as('getUserProfile');
    cy.intercept('GET', '**/pet*').as('getPets');
    
    cy.log('Iniciando sesión con un usuario válido');
    cy.visit('/login');  
    cy.get('input[name="email"]').type('tester@gmail.com'); 
    cy.get('input[name="password"]').type('test12345');  
    cy.get('button[type="submit"]').click();  
    
    cy.log('Esperando la respuesta de perfil y mascotas');
    cy.wait('@getUserProfile', waitOptions);
    cy.wait('@getPets', waitOptions);
    cy.wait(10000);
  
    cy.log('Verificando que la información del perfil y las mascotas se muestre correctamente');
    cy.get('h2.text-xl.font-bold.mt-2', waitOptions).should('contain.text', 'Tester Tester');  
    cy.contains('Tus Mascotas Registradas', waitOptions).should('be.visible');  
    cy.url(waitOptions).should('include', '/user-profile');  

    cy.log('Verificando la navegación hacia la página de agregar mascota');
    cy.contains('button', 'Agregar Mascota', waitOptions).click();
    cy.wait(5000);
    cy.url(waitOptions).should('include', '/pet/register'); 
    cy.go('back');  
    cy.wait(10000);
    
    cy.log('Verificando la navegación hacia la lista de mascotas');
    cy.contains('a', 'Ver mi lista de mascotas', waitOptions).click();
    cy.wait(10000);
    cy.url(waitOptions).should('include', '/list-pets');  
    cy.go('back'); 
    
    cy.log('Verificando las tarjetas de mascotas');
    cy.get('section', waitOptions).then(($section) => {
      if ($section.text().includes('No tienes mascotas registradas.')) {
        cy.contains('No tienes mascotas registradas.', waitOptions).should('be.visible');
      } else {
        cy.get('a[href*="/detalle-mascota/"]', waitOptions)
          .should('have.length.greaterThan', 0)
          .first()
          .click();  
        cy.url(waitOptions).should('include', '/detalle-mascota/');
      }
    });
  });
});
