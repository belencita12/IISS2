describe('Página de Detalles del Cliente', () => {
    const SESSION_KEY = "sessionToken";
    const BASE_URL = "https://iiss2-backend-0q2e.onrender.com";
  
    beforeEach(() => {
      const sessionToken: string = Cypress.env(SESSION_KEY);
      if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);

      cy.intercept('GET', '/dashboard/products', {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Producto A',
            price: 100,
            stock: 10
          },
          {
            id: 2,
            name: 'Producto B',
            price: 200,
            stock: 5
          }
        ]
    }).as('getProducts');

    });
  
    it('login', () => {
  
      // establecer sesión
      const USER = {
        email: "makiko.yamamoto@fiuni.edu.py",
        password: "MakiYamaGin"
      };
  
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
      
    })

    
    
    it('Debe mostrar el listado de productos si existen', () => {
        
        cy.visit('/dashboard');

        // cy.wait('@getProducts');
        cy.contains('p', "Productos").click();

        cy.get('select[title="type"]').select('PRODUCT');
        cy.get('h1').should('contain', 'Productos');
        // Verifica que haya al menos un producto listado
        cy.get('div[class*="bg-card"]').should('have.length.at.least', 1);
        cy.wait(3000);
        cy.get('button:has("svg"):visible').first().click();
        

        cy.get('select[title="type"]').select('VACCINE');
        cy.get('div[class*="bg-card"]').should('have.length.at.least', 1);
        cy.wait(3000);
        cy.get('button:has("svg"):visible').first().click();
        
    });



 
    it("Navega al detalle de un producto al hacer click en la card", () => {

        cy.visit('/dashboard');

        // cy.wait('@getProducts');
        cy.contains('p', "Productos").click();

        cy.get('div[class*="bg-card"]').first().find('img').click();
        
      
        //cy.url().should("include", "/dashboard/products/**");
        //cy.wait(3000);
    });
 
  
 
  
  
})