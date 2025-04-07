describe('Página de Lista de Productos', () => {
  const SESSION_KEY = "sessionToken";
  const BASE_URL = Cypress.env("API_BASEURL");

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

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
      email: "makiko.yamamoto3@fiuni.edu.py",
      password: "MakiYamaGin3"
    };

    cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);

  })



  it('Debe mostrar el listado de productos si existen', () => {

    cy.visit('/dashboard');

    cy.contains('p', "Productos").click();
  
    cy.get(':nth-child(1) > .gap-2 > .truncate', { timeout: 10000 }).should('be.visible').click();

   /*  cy.get('div[data-value="Producto"]').click();
    cy.wait(3000);
    //cy.contains("PRODUCT").should('be.visible');
    //cy.get('h1').should('contain', 'PRODUCT');
    cy.get('div[class*="bg-card"]').should('have.length.at.least', 1);
    cy.wait(3000);
    cy.get('button:has(svg):visible').first().click(); */
  
    // Cambiar a "Vacuna"
    // cy.get(':nth-child(1) > .gap-2 > .truncate', { timeout: 10000 }).should('be.visible').click();
    // cy.wait(3000);
    // cy.contains('div[data-value="Vacuna"]').click();
  
    // cy.get('div[class*="bg-card"]').should('have.length.at.least', 1);
    // cy.wait(3000);
    // cy.get('button:has(svg):visible').first().click();

    
 

  });




  it("Navega al detalle de un producto al hacer click en la card", () => {

    cy.visit('/dashboard');

    // cy.wait('@getProducts');
    cy.contains('p', "Productos").click();

    cy.get('div[class*="bg-card"]').first().within(parent => {
      const $img = parent.find('img'); // jQuery .find() runs immediately, no retry
      const $div = parent.find('div[class="w-full h-full flex items-center justify-center bg-gray-200 rounded"]');

      if ($img.length > 0) {
        cy.log(' Found an <img>, clicking...');
        cy.wrap($img.first()).click();
      } else if ($div.length > 0) {
        cy.log(' No <img>, but found <div>, clicking...');
        cy.wrap($div.first()).click();
      } else {
        cy.log(' No <img> or <div> found.');
      }
    });


    //cy.url().should("include", "/dashboard/products/**");
    //cy.wait(3000);
  });





})