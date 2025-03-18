describe('Página de Detalles del Cliente', () => {
  const SESSION_KEY = "sessionToken";
  const BASE_URL = "https://iiss2-backend-0q2e.onrender.com";

  beforeEach(() => {
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
        const pets:any[] = interception.response?.body.data;
        pets.forEach((pet) => {
          cy.contains(pet.name).should('exist');
        });
      });
  });

/*   it('debería mostrar un mensaje "Not Found" cuando el cliente no existe', () => { 
      const clientNone = 9999; // Un ID de cliente que no existe en el sistema
        // Intercepta la llamada al cliente
      cy.intercept("GET", `/api/auth/session`).as("getAuthData"),{
        statusCode: 404,
        body: { message: "Client not found" }
      };
  
      cy.visit(`/dashboard/clients/${clientNone}`);
    
      cy.wait("@getClientNotFound");
    
      // Verificar que el mensaje "Not Found" sea visible en la pantalla
      cy.contains('Not Found').should('be.visible');
    }); */
  
 /*    it('debería mostrar el botón "Agregar"', () => {
      const clientId = 3;
      cy.visit(`/dashboard/clients/${clientId}`);
      
      cy.get('button').contains('Agregar').should('be.visible');
    });  */

  /*  it('debería mostrar la tabla de mascotas con los datos correctos', () => {
     const clientId = 7;
     cy.intercept("GET", `${BASE_URL}/pets/${clientId}`).as("getPets");
 
     cy.visit(`/dashboard/clients/${clientId}`);
     
     cy.wait("@getPets").then((interception) => {
       expect(interception.response?.statusCode).to.eq(200);
       const pets = interception.response?.body;
       
       pets.forEach((pet:any, index:any) => {
         // Verificar que la imagen de la mascota esté presente
         cy.get(`.pet-image-${index}`).should('have.attr', 'src').and('include', pet.profileImg?.previewUrl || "/image (4).png");
         
         // Verificar que el nombre de la mascota esté presente en la columna "Nombre"
         cy.get(`.pet-name-${index}`).should('contain.text', pet.name);
         
         // Verificar que la especie de la mascota esté presente en la columna "Especie"
         cy.get(`.pet-species-${index}`).should('contain.text', pet.species.name);
         
         // Verificar que la raza de la mascota esté presente en la columna "Raza"
         cy.get(`.pet-race-${index}`).should('contain.text', pet.race.name);
       });
   }); */

  /*   it('debería manejar errores correctamente cuando no se cargan los datos del cliente', () => {
      const clientId0 = 2;  // Ejemplo de ID de cliente
      cy.intercept("GET", `${BASE_URL}/client/${clientId}`, {
        statusCode: 500,
        body: { error: 'Error al cargar los datos del cliente' },
      }).as("getClientError");
  
      cy.visit(`/dashboard/clients/${clientId0}`);
  
      cy.wait("@getClientError");
      
      cy.contains('Error al cargar los datos del cliente').should('be.visible');
    }); */

  // Test de Paginación en la tabla de mascotas
    it('debería permitir la paginación en la tabla de mascotas', () => {
      const clientId = 7; 
     
      // Intercepta la llamada al cliente
      cy.intercept("GET", `/api/auth/session`).as("getAuthData");
  
      // Intercepta la llamada a las mascotas
      cy.intercept("GET", `${BASE_URL}/pet?page=1&userId=${clientId}`).as("getPets");
  
      cy.visit(`/dashboard/clients/${clientId}`); 
      
      
      // Simular hacer clic en el botón de paginación "Siguiente"
      cy.get('aria-label').click();
      cy.url().should('include', 'page=2');  
    });
  
    it('debería mostrar un mensaje cuando no haya mascotas disponibles', () => {
      const clientId = 1;  // Ejemplo de ID de cliente
     
    // Intercepta la llamada al cliente
    cy.intercept("GET", `/api/auth/session`).as("getAuthData");

    // Intercepta la llamada a las mascotas
    cy.intercept("GET", `${BASE_URL}/pet?page=1&userId=${clientId}`).as("getPets");

    cy.visit(`/dashboard/clients/${clientId}`);
      
      cy.wait("@getPets");
    
      // Verificar que el mensaje "No hay mascotas disponibles" sea visible
      cy.contains('No hay mascotas disponibles').should('be.visible');
    });
  });

 
