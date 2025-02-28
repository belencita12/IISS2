describe('Solicitud de recuperación de contraseña', () => {  
    const validEmail = 'lourdesvalenzuelalucianascheid@gmail.com';  
    const unregisteredEmail = 'email_que_no_existe@example.com';  
  
    beforeEach(() => {   
      cy.visit('/forgot-password');  
      cy.wait(500); 
    });  
  
    it('muestra la interfaz de recuperación de contraseña correctamente', () => {  
      cy.contains('h2', 'Recuperar contraseña').should('be.visible');  
      cy.get('input[type="email"]').should('be.visible');  
      cy.get('button[type="submit"]').should('be.visible');  
    });  
  
    it('valida el formato del email', () => {  
      cy.get('input[id="email"]').type('correo-invalido', { delay: 200 });  
      cy.get('button[type="submit"]').click();  
      cy.get('input[id="email"]:invalid').should('exist');  
    });  
  
    it('muestra error cuando el email no está registrado', () => {  
      cy.get('input[id="email"]').type(unregisteredEmail, { delay: 200 });  
      cy.get('button[type="submit"]').click();  
      cy.contains('Este correo no está asociado a ninguna cuenta', { timeout: 10000 }).should('be.visible');  
    });  
  
    it('muestra mensaje de éxito cuando se envía el enlace correctamente', () => {   
      cy.intercept('POST', '**/auth/token/reset-password').as('sendEmail');  
  
      cy.get('input[id="email"]').type(validEmail, { delay: 200 });  
      cy.get('button[type="submit"]').click();  
  
      cy.wait('@sendEmail').its('response.statusCode').should('eq', 200);  
      cy.contains('Email enviado correctamente', { timeout: 10000 }).should('be.visible');  
  
      cy.log('Copia el token de la URL del email y pégalo manualmente en el siguiente test.');
    });  
  });
  