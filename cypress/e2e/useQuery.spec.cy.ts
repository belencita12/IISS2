

describe('Página de Razas, probando useQuery', () => {
  const SESSION_KEY = "sessionToken"; 
  const BASE_URL = Cypress.env("API_BASEURL");

  beforeEach(() => {
    // Limpiar cookies y almacenamiento local antes de cada prueba
    cy.clearCookies();
    cy.clearLocalStorage();

    // Obtener el token de sesión del entorno
    const sessionToken = Cypress.env(SESSION_KEY);
    if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);
    
    // Mock de la respuesta de la API con más de 16 items para activar la paginación
    cy.intercept('GET', '/api/races*', (req) => {
      // Verificar que el token esté siendo pasado correctamente
      expect(req.headers['authorization']).to.eq(`Bearer ${sessionToken}`);
      
      req.reply({
        statusCode: 200,
        body: {
          items: Array.from({ length: 20 }, (_, index) => ({ id: index + 1, name: `Raza ${index + 1}` })),
          meta: {
            totalPages: 2,
          },
        },
      });
    }).as('getRaces');
  });

  it('debería cargar las razas y mostrarlas', () => {
    // Visitar la página de razas
    cy.visit(`${BASE_URL}/races`);

    // Verificar que la página está cargando inicialmente
    cy.get('div').contains('Cargando...').should('exist');

    // Esperar a que se termine la carga
    cy.wait('@getRaces');

    // Verificar que las razas se muestran correctamente
    cy.get('ul li').should('have.length', 16); // Se asume que se muestran 16 por página
    cy.get('ul li').eq(0).contains('Raza 1');
    cy.get('ul li').eq(1).contains('Raza 2');
    cy.get('ul li').eq(15).contains('Raza 16');
  });

  it('debería manejar los errores correctamente', () => {
    // Simular un error en la API
    cy.intercept('GET', '/api/races*', {
      statusCode: 500,
      body: { message: 'Error al obtener las razas' },
    }).as('getRacesError');

    // Visitar la página de razas
    cy.visit(`${BASE_URL}/races`);

    // Verificar que se muestra un mensaje de error
    cy.wait('@getRacesError');
    cy.get('div').contains('Error: Error al obtener las razas').should('exist');
  });

  it('debería cambiar de página al hacer clic en los botones de paginación', () => {
    // Interceptar la respuesta para la primera página (más de 16 items)
    cy.intercept('GET', '/api/races?page=1', {
      statusCode: 200,
      body: {
        items: Array.from({ length: 16 }, (_, index) => ({ id: index + 1, name: `Raza ${index + 1}` })),
        meta: {
          totalPages: 2,
        },
      },
    }).as('getPage1');

    // Interceptar la respuesta para la segunda página
    cy.intercept('GET', '/api/races?page=2', {
      statusCode: 200,
      body: {
        items: Array.from({ length: 4 }, (_, index) => ({ id: index + 17, name: `Raza ${index + 17}` })),
        meta: {
          totalPages: 2,
        },
      },
    }).as('getPage2');

    // Visitar la página de razas
    cy.visit(`${BASE_URL}/races`);

    // Verificar que estamos en la primera página y mostramos los primeros 16 items
    cy.wait('@getPage1');
    cy.get('ul li').should('have.length', 16);
    cy.get('ul li').contains('Raza 1');
    cy.get('ul li').contains('Raza 16');

    // Hacer clic en "Siguiente"
    cy.get('button').contains('Siguiente').click();
    cy.wait('@getPage2');

    // Verificar que estamos en la segunda página y mostramos los items del 17 al 20
    cy.get('ul li').should('have.length', 4);
    cy.get('ul li').contains('Raza 17');
    cy.get('ul li').contains('Raza 20');
  });
});

