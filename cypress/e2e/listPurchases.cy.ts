describe('Página de Lista de Compras', () => {
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
        email: "makiko.yamamoto3@fiuni.edu.py",
        password: "MakiYamaGin3"
      };
  
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
  
    })
  
  
  
    it('Debe mostrar el listado de Compras', () => {
  
      cy.visit('/dashboard');
  
      cy.contains('p', "Compras").click();
      cy.wait(3000);
      
      
  
    });
  
   

    it('Debe abrir la página de registrar compras y mostrar que los datos deben ser ingresados, volver con cancelar', () => {
        cy.visit('/dashboard/purchases');
        cy.get('button').contains('Registrar Compra').click();
        cy.wait(5000);
        cy.url().should('include', '/dashboard/purchases/register');
        cy.get('button').contains('Registrar Compra').click();
        cy.wait(5000);
        cy.get('button').contains('Cancelar').click();
        cy.wait(5000);
    });

});