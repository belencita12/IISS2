describe('Página de Lista de Movimientos', () => {
    const SESSION_KEY = "sessionToken";
    const BASE_URL = Cypress.env("API_BASEURL");
  
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
  
      const sessionToken: string = Cypress.env(SESSION_KEY);
      if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);
    });
  
    it('login', () => {
  
      // establecer sesión
      const USER = {
        email:  Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A")
      };
  
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
  
    })
  
  
  
    it('Debe mostrar el listado de Movimientos', () => {
  
      cy.visit('/dashboard');
  
      cy.contains('p', "Movimientos").click();
      cy.wait(3000);
      cy.get('.text-2xl').should('contain', 'Movimientos');
      
  
    });
  /*
    it('Debe buscar movimiento correctamente filtrandolos por ruc', () => {
        cy.visit('/dashboard/movement');
        cy.get('.relative > .flex').type('1232410-1');
        cy.wait(3000);
    });*/

    it('Debe buscar movimiento correctamente filtrando por nombre de producto "Correa"', () => { 
      cy.visit('/dashboard/movement');
    
      // Buscar por nombre de producto
      cy.get('input[placeholder="Buscar por nombre de producto"]').type('Correa');
      cy.wait(10000);
      // Hacer clic en el movimiento que contiene ese producto
      cy.contains('Movimiento Entrante').click();
    
      // Verificar que la URL ahora sea la de detalle del movimiento
      cy.url().should('include', '/dashboard/movement/');
      cy.get('h1').should('contain', 'Movimiento');
      // Verifica que el producto exista en la lista
      cy.contains('Correa').should('exist');
    });
    

    // it('Debe abrir la página de registrar movimientos', () => {
    //     cy.visit('/dashboard/movement');
    //     cy.get('button').contains('Registrar Movimiento').click();
    //     cy.wait(5000);
    //     cy.url().should('include', '/dashboard/movement/register');
    // });

});