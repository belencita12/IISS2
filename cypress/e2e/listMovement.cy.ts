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
  
    it('Debe buscar movimiento correctamente filtrandolos por ruc', () => {
        cy.visit('/dashboard/movement');
        cy.get('.relative > .flex').type('7654321-2');
        cy.wait(3000);
        
    });

    // it('Debe abrir la página de registrar movimientos', () => {
    //     cy.visit('/dashboard/movement');
    //     cy.get('button').contains('Registrar Movimiento').click();
    //     cy.wait(5000);
    //     cy.url().should('include', '/dashboard/movement/register');
    // });

});