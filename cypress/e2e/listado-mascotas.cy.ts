describe('Listado de Mascotas', () => {
    const waitOptions = { timeout: 30000 };
  
    it('Muestra la lista de mascotas y permite filtrar, limpiar, cambiar de vista y navegar', () => {
      cy.intercept('GET', '**/user-profile*').as('getUserProfile');
      cy.intercept('GET', '**/pet*').as('getPets');
      
      cy.visit('/login');
      cy.get('input[name="email"]').type('adarogessica@gmail.com');
      cy.get('input[name="password"]').type('adaro903');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@getUserProfile', waitOptions);
      cy.wait('@getPets', waitOptions);
      cy.wait(5000);
      
      cy.get('h2.text-xl.font-bold.mt-2', waitOptions).should('contain.text', 'Gessica Adaro');
      cy.contains('Tus Mascotas Registradas', waitOptions).should('be.visible');
      cy.url(waitOptions).should('include', '/user-profile');
      
      cy.contains('a', 'Ver mi lista de mascotas', waitOptions).click();
      cy.wait(10000);
      cy.url(waitOptions).should('include', '/list-pets');
      
      cy.get('.grid', waitOptions).should('exist').and('be.visible');
      cy.wait(3000);
      
      // Cambio de vista
      cy.get('div.w-auto.flex.gap-2.items-center.justify-end').within(() => {
        cy.get('button').eq(1).click(); 
      });
      cy.wait(5000);
      cy.get('.flex.flex-col.space-y-4.pb-10', waitOptions).should('exist');
      
      cy.get('div.w-auto.flex.gap-2.items-center.justify-end').within(() => {
        cy.get('button').eq(0).click(); 
      });
      cy.wait(5000);
      cy.get('.grid', waitOptions).should('exist');
      
      
      cy.get('input[type="text"]', waitOptions).clear().type('kira');// Filtra
      cy.wait(5000);
      
      cy.contains('Limpiar', waitOptions).click();
      cy.wait(5000);
      cy.get('input[type="text"]', waitOptions).should('have.value', '');
      
     
      cy.get('a[aria-label="Go to next page"]', waitOptions).click(); // Pagina
      cy.wait(10000);
      cy.contains('a', '2', waitOptions).should('have.class', 'font-bold');
      

      cy.get('a[href*="/detalle-mascota/"]', waitOptions)
        .should('have.length.greaterThan', 0)
        .first()
        .click();
      cy.wait(10000);
      cy.url(waitOptions).should('include', '/detalle-mascota/');
    });
  
    it('Muestra mensaje de "Lista vacía" cuando el usuario no tiene mascotas', () => {
      cy.intercept('GET', '**/user-profile*').as('getUserProfile');
      cy.intercept('GET', '**/pet*').as('getPets');
      
      cy.visit('/login');
      cy.get('input[name="email"]').type('ramirez@gmail.com');
      cy.get('input[name="password"]').type('ramirez123');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@getUserProfile', waitOptions);
      cy.wait('@getPets', waitOptions);
      cy.wait(5000);
      
      cy.get('h2.text-xl.font-bold.mt-2', waitOptions).should('contain.text', 'Ramirez');
      cy.contains('Tus Mascotas Registradas', waitOptions).should('be.visible');
      cy.url(waitOptions).should('include', '/user-profile');
      
      cy.contains('a', 'Ver mi lista de mascotas', waitOptions).click();
      cy.wait(10000);
      cy.url(waitOptions).should('include', '/list-pets');
      
      cy.get('.grid', waitOptions).should('exist').and('be.visible');
      cy.wait(5000);
      
      cy.contains('Lista vacía', waitOptions).should('be.visible');
    });
  });
  