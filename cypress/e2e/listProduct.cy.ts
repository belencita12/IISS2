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
        
        cy.visit('/dashboard/products');
        cy.wait('@getProducts');

        cy.contains('option', 'type').click();
        cy.contains('option', 'PRODUCT').click();
        cy.get('h1').should('contain', 'Productos');

        cy.intercept('GET', '/dashboard/products', {
            statusCode: 200,
            body: [] // Lista vacía
        }).as('getProductsEmpty');

        // Verifica que haya al menos un producto listado
        cy.get('[data-cy=product-card]').should('have.length.at.least', 1);

        cy.contains('button', 'X').click();
        cy.contains('option', 'VACCINE').click();
    });


    it('Debe mostrar y ocultar productos al hacer clic en "X"', () => {
        // Hacer clic en el primer producto
        cy.visit('/dashboard/products');
        cy.wait('@getProducts');
    
        cy.contains('option', 'type').click();
        // Hacer clic en la "X" para cerrar
        cy.contains('option', 'VACCINE').click();
        cy.contains('button', 'X').click();
    });
 
    it("Navega al detalle de un producto al hacer click en la card", () => {

        cy.visit('/dashboard/products');
        cy.wait('@getProducts');
    
        cy.get('[data-testid="product-card"]').first().click();
        cy.url().should("include", "/product/1");
    });
 
  
 
  
  
})