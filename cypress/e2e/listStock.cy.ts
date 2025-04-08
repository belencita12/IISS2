describe('Página de Lista de Depositos', () => {
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
  
  
  
    it('Debe mostrar el listado de depositos', () => {
  
      cy.visit('/dashboard');
  
      cy.contains('p', "Depositos").click();
      cy.wait(3000);
    
      cy.get(':nth-child(1) > .flex > a > .inline-flex', { timeout: 5000 }).should('be.visible').click();
     
  
    });
  
  
  
  
    it("Navega al detalle de producto en un deposito", () => {
  
      cy.visit('/dashboard/stock/6');
   
   
    });
  
});