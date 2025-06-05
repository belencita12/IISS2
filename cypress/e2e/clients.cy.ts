describe('Página de Detalles del Cliente', () => {
  const SESSION_KEY = "sessionToken";
  const BASE_URL = Cypress.env("API_BASEURL");

  interface Pet {
    id: number;
    name: string;
  }

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    const sessionToken: string = Cypress.env(SESSION_KEY);
    if (sessionToken) {
      cy.setCookie("next-auth.session-token", sessionToken);
    }
  });

  it('login', () => {
    const USER = {
      email: "admin@gmail.com",
      password: "12345678"
    };
    cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
  });

  it('debería mostrar la información del perfil del cliente correctamente', () => {
    const clientId = 3;

    cy.intercept("GET", "**/auth/session").as("getAuthData");
    cy.intercept("GET", `${BASE_URL}/pet**`).as("getPets");

    cy.visit(`/dashboard/clients/${clientId}`);

    cy.contains('Florentino Valgaba').should('exist');

    cy.wait("@getPets").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      const pets: Pet[] = interception.response?.body.data;
      pets.forEach((pet) => {
        cy.contains(pet.name).should('exist');
      });
    });
  });

  it('debería mostrar un mensaje cuando no haya mascotas disponibles', () => {

    cy.intercept("GET", "**/auth/session").as("getAuthData");
    cy.intercept("GET", `${BASE_URL}/pet**`).as("getPets");

    cy.visit(`/dashboard/clients/10`);

    cy.wait("@getPets");

    cy.contains('No se encontraron mascotas.').should('be.visible');
  });

  it('debería mostrar un mensaje "Not Found" cuando el cliente no existe', () => {
    const clientNone = 9999;

    cy.intercept("GET", `${BASE_URL}/client/${clientNone}`, {
      statusCode: 404,
      body: { message: "Client not found" }
    }).as("getClient");

    cy.visit({
      url: `/dashboard/clients/${clientNone}`,
      failOnStatusCode: false,
    });

    cy.wait(2000);
    cy.contains('Página no encontrada').should('be.visible');
  });

  it('debería mostrar el botón "Agregar"', () => {
    const clientId = 12;

    cy.intercept("GET", "**/auth/session").as("getAuthData");

    cy.visit(`/dashboard/clients/${clientId}`);
    cy.get('button').contains('Agregar').should('be.visible');
  });

  it('debería permitir la paginación en la tabla de mascotas', () => {
    const clientId = 2;

    cy.intercept("GET", "**/auth/session").as("getAuthData");
    cy.intercept("GET", `${BASE_URL}/pet**`).as("getPets");

    cy.visit(`/dashboard/clients/${clientId}`);

    cy.get('body').then(($body) => {
      if ($body.find('span:contains("Next")').length > 0) {
        cy.get('span:contains("Next")').click();
        cy.get('a[aria-current="page"]').should('contain', '2');
      } else {
        cy.log('No existe la paginación');
      }
    });
  });
});
