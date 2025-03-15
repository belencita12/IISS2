

describe('ClientProfileSection', () => {
const SESSION_KEY = "sessionToken";

    it("iniciar sesión", () => {
        const USER = {
        email: "andres.cabrera@fiuni.edu.py",
        password: "asdqwe123"
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
  });
  
  