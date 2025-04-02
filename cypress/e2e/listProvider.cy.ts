describe('Página de Lista de Proveedores', () => {
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
  
  
  
    it('Debe mostrar los settings para ir a la lista de proveedores', () => {
  
      cy.visit('/dashboard');
  
      // cy.wait('@getProducts');
      cy.contains('p', "Configuración").click();

      cy.get('[href="/dashboard/settings/races"]').click();
      cy.wait(3000);
      cy.visit('/dashboard/settings')
      cy.wait(3000);
      cy.get('[href="/dashboard/settings/species"]').click();
      cy.wait(3000);
      cy.visit('/dashboard/settings')
      cy.wait(3000);
      cy.get('[href="/dashboard/settings/positions"]').click();
      cy.wait(3000);
      cy.visit('/dashboard/settings')
      cy.wait(3000);
      cy.get('[href="/dashboard/settings/providers"]').click;
      cy.wait(3000);
  
    });
  
  
  
  
    it("Muesta un modal de detalle de proveedores al hacer click al icon", () => {
      
      cy.visit('/dashboard/settings/providers');
      cy.wait(3000);
  
      cy.get('button[title="Ver detalles"]').first().click();
  
    });
  
  
     
});
