describe('Página de Lista de recibos', () => {
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
  
  
  
    it('Debe mostrar los settings para ir recibos', () => {
  
      cy.visit('/dashboard');
  
      // cy.wait('@getProducts');
      cy.contains('p', "Configuración").click();

      cy.visit('/dashboard/settings')
      cy.wait(3000);
      cy.get('[href="/dashboard/settings/receipts"]').click();
      cy.get('.text-3xl').should('contain', 'Recibos');
      cy.wait(3000);
      
    });
  
    it('Debe mostrar el detalle del recibo con ID 3', () => {
      cy.visit('/dashboard/settings/receipts/3', { timeout: 25000 });
      cy.url().should('include', '/dashboard/settings/receipts/3');
      cy.get("div.animate-pulse", { timeout: 25000 }).should("not.exist");
      cy.contains('h1.text-2xl', 'Detalle del Recibo', { timeout: 10000 }).should('be.visible');
    });
     
});
