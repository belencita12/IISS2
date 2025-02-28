describe('Recuperación de contraseña', () => {
    const validEmail = 'lourdesvalenzuelalucianascheid@gmail.com';
    const newPassword = 'NuevaContraseña123';
    const mailtrapApiToken = '4ed78d51e512e4dc74fa82e6b368b493';
    const accountId = '2229723'; // ID de la cuenta en Mailtrap
    const inboxId = '3495816'; // ID del inbox en Mailtrap
  
    it('envía un correo con enlace de recuperación de contraseña', () => {
      cy.visit('/forgot-password');
      cy.get('input[id="email"]').type(validEmail);
      cy.get('button[type="submit"]').click();
  
      cy.contains('Email enviado correctamente', { timeout: 10000 }).should('be.visible');
    });
  
    it('obtiene el token de Mailtrap y lo usa para restablecer la contraseña', () => {
      
      cy.wait(5000);
  
      // traemos la lista de correos en Mailtrap
      cy.request({
        method: 'GET',
        url: `https://sandbox.api.mailtrap.io/api/accounts/${accountId}/inboxes/${inboxId}/messages`,
        headers: { 'Api-Token': mailtrapApiToken },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const messages = response.body;
  
        if (messages.length === 0) {
          throw new Error(' No se encontraron emails en Mailtrap.');
        }
  
        const latestEmailId = messages[0].id;
  
        // trae el contenido del último correo
        cy.request({
          method: 'GET',
          url: `https://sandbox.api.mailtrap.io/api/accounts/${accountId}/inboxes/${inboxId}/messages/${latestEmailId}`,
          headers: { 'Api-Token': mailtrapApiToken },
        }).then((emailResponse) => {
          expect(emailResponse.status).to.eq(200);
          const emailBody = emailResponse.body.html_body;
  
          // trae el token de la URL en el email
          const tokenMatch = emailBody.match(/reset-password\?token=([^"&]+)/);
          if (!tokenMatch) {
            throw new Error('No se encontró el token en el email.');
          }
  
          const resetToken = tokenMatch[1];
  
          cy.wrap(resetToken).as('resetToken');
        });
      });
    });
  
    it('restablece la contraseña con el token obtenido', function () {
      cy.get('@resetToken').then((resetToken) => {
        cy.visit(`/reset-password?token=${resetToken}`);
  
        cy.get('input[id="password"]').type(newPassword);
        cy.get('input[id="confirmPassword"]').type(newPassword);
        cy.get('button[type="submit"]').click();
  
        cy.contains('Contraseña restablecida con éxito', { timeout: 10000 }).should('be.visible');
  
   
        cy.request({
          method: 'POST',
          url: '/auth/login',
          body: { email: validEmail, password: newPassword },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('token');
        });
      });
    });
  });
  