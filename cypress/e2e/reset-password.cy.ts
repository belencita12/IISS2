describe('Formulario de restablecimiento de contraseña', () => {  
    const realToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzQwNzYyODU2LCJleHAiOjE3NDA3NjQ2NTZ9.ysygPdfubpUBcxyLRWx_qK8nMbMzdj9_qN0XYamUtC8'; 
    const newPassword = 'NuevaContraseña123';  
    const validEmail = 'lourdesvalenzuelalucianascheid@gmail.com';  
  
    beforeEach(() => {  
      cy.visit(`/reset-password?token=${realToken}`);
      cy.wait(500);
    });  
  
    it('muestra la interfaz de restablecimiento correctamente', () => {  
      cy.contains('h2', 'Restablecer contraseña').should('be.visible');  
      cy.get('input[id="password"]').should('be.visible');  
      cy.get('input[id="confirmPassword"]').should('be.visible');  
      cy.get('button[type="submit"]').should('be.visible');  
    });  
  
    it('valida que las contraseñas coincidan', () => {  
      cy.get('input[id="password"]').type(newPassword, { delay: 200 });  
      cy.get('input[id="confirmPassword"]').type('ContraseñaDiferente', { delay: 200 });  
      cy.get('button[type="submit"]').click();  
      cy.contains('Las contraseñas no coinciden').should('be.visible');  
    });  
  
    it('muestra mensaje de éxito al restablecer la contraseña y verifica el cambio en el backend', () => {  
        cy.intercept('PUT', '**/auth/reset-password*').as('resetSuccess');
 
  
      cy.get('input[id="password"]').type(newPassword, { delay: 200 });  
      cy.get('input[id="confirmPassword"]').type(newPassword, { delay: 200 });  
      cy.get('button[type="submit"]').click();  
  
      cy.wait('@resetSuccess').its('response.statusCode').should('eq', 200);  
      cy.contains('Contraseña restablecida con éxito').should('be.visible');  
      cy.contains('Redirigiendo...').should('be.visible');  
  
      // Verifica que la contraseña se cambió en el backend
      cy.request({
        method: 'POST',
        url: 'https://actual-maribeth-fiuni-9898c42e.koyeb.app/auth/login',
        body: { email: validEmail, password: newPassword },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
      });
    });  
  });
  