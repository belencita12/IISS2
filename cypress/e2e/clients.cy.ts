/* 

describe('ClientProfileSection', () => {
const SESSION_KEY = "sessionToken";

    it("iniciar sesión", () => {
        const USER = {
        email: "makiko.yamamoto@fiuni.edu.py",
        password: "MakiYamaGin"
        };
    
        cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });

    it('Muestra la información del cliente correctamente', () => {
        const sessionToken: string = Cypress.env(SESSION_KEY);
        if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);

      cy.visit('/dashboard/clients/2'); 
  
      // Verifica que el nombre completo del cliente esté presente
      cy.contains('Lindsey Stroud').should('exist');
      
      // Verifica que el correo electrónico del cliente esté presente
      cy.contains('lindsey.stroud.@example.com').should('exist');
      
      // Verifica que la imagen de perfil esté presente
      cy.get('img[alt="Lindsey Stroud"]').should('exist');
    });

    it('Muestra el mensaje de "sin mascotas"', () => {
      cy.visit('/dashboard/clients/2');
  
      // Verifica que se muestra la sección de mascotas
      cy.contains('Mascotas').should('exist');
  
      // Ahora verifica que aparezca el mensaje de "sin mascotas"
      cy.contains(/no tiene mascotas registradas/i).should('exist');
  
      // Opcional: Verifica que la tabla no se muestre
      cy.get('table').should('not.exist');
    });
  
    it('El botón "Agregar" sigue estando visible', () => {
      cy.visit('/dashboard/clients/2');
  
      // El botón debería estar aunque no haya mascotas
      cy.get('button').contains('Agregar').should('exist');
  
    
    });
  });
   */
  