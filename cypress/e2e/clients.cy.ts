describe('Página de Detalles del Cliente', () => {
  const SESSION_KEY = "sessionToken";
  const BASE_URL = Cypress.env("API_BASEURL");

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    const sessionToken: string = Cypress.env(SESSION_KEY);
    if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);
  });

  it('login', () => {

    // Simular inicio de sesión válido y establecer sesión
    const USER = {
      email: "makiko.yamamoto@fiuni.edu.py",
      password: "MakiYamaGin"
    };

    cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
  })

  it('debería mostrar la información del perfil del cliente correctamente', () => {
    const clientId = 7;

    // Intercepta la llamada al cliente
    cy.intercept("GET", `/api/auth/session`).as("getAuthData");

    // Intercepta la llamada a las mascotas
    cy.intercept("GET", `${BASE_URL}/pet?page=1&userId=${clientId}`).as("getPets");

    cy.visit(`/dashboard/clients/${clientId}`);

    // Espera la respuesta del cliente y verifica datos personales
    cy.wait("@getAuthData").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      const client = interception.response?.body.user;
      cy.contains(client.fullName).should('exist');
    });
    // Espera la respuesta de las mascotas y verifica listado
    cy.wait("@getPets").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      const pets: any[] = interception.response?.body.data;
      pets.forEach((pet) => {
        cy.contains(pet.name).should('exist');
      });
    });
  });

  it('debería mostrar un mensaje "Not Found" cuando el cliente no existe', () => {
    const clientNone = 9999; // Un ID de cliente que no existe en el sistema
    // Intercepta la llamada al cliente
    cy.intercept("GET", `/api/auth/session`).as("getAuthData"), {
      statusCode: 404,
      body: { message: "Client not found" }
    };
    cy.visit({
      url: `/dashboard/clients/${clientNone}`, // URL que puede fallar
      failOnStatusCode: false,  
    })


    cy.wait(4000);
    cy.contains('Página no encontrada').should('be.visible');

  });

  it('debería mostrar el botón "Agregar"', () => {
    const clientId = 3;
    cy.visit(`/dashboard/clients/${clientId}`);
    cy.intercept("GET", `/api/auth/session`).as("getAuthData");
    cy.get('button').contains('Agregar').should('be.visible');
  });

  it('debería permitir la paginación en la tabla de mascotas', () => {
    // Test de Paginación en la tabla de mascotas
    const clientId = 7;

    // Intercepta la llamada al cliente
    cy.intercept("GET", `/api/auth/session`).as("getAuthData");

    // Intercepta la llamada a las mascotas
    cy.intercept("GET", `${BASE_URL}/pet?page=1&userId=${clientId}`).as("getPets");

    cy.visit(`/dashboard/clients/${clientId}`);
    
    cy.get('body').then(($body) => {
      if ($body.find('span:contains("Next")').length > 0) {
        // Simular hacer clic en el botón de paginación "Siguiente"
        cy.get('span:contains("Next")').click();
        //  Verificar que el paginador se actualizó a página 2
        cy.get('a[aria-current="page"]').should('contain', '2');
      } else {
        cy.log('No existe la paginacion');
      }
    });

  });

  it('debería mostrar un mensaje cuando no haya mascotas disponibles', () => {
    const clientId = 82;  // Ejemplo de ID de cliente

    // Intercepta la llamada al cliente
    cy.intercept("GET", `/api/auth/session`).as("getAuthData");

    // Intercepta la llamada a las mascotas
    cy.intercept("GET", `${BASE_URL}/pet?page=1&userId=${clientId}`).as("getPets");

    cy.visit(`/dashboard/clients/${clientId}`);

    cy.wait("@getPets");

    // Verificar que el mensaje "No hay mascotas disponibles" sea visible
    cy.contains('No hay mascotas disponibles').should('be.visible');
  });

})


