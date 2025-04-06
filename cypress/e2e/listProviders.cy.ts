describe('Página de Lista de Proveedores', () => {
    const SESSION_KEY = "sessionToken";
    const BASE_URL = Cypress.env("API_BASEURL");
  
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
  
      const sessionToken: string = Cypress.env(SESSION_KEY);
      if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);

    
    });

  
    it('login', () => {
  
      // establecer sesión
      const USER = {
        email: "makiko.yamamoto3@fiuni.edu.py",
        password: "MakiYamaGin3"
      };
  
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);

  
    })
  
  
  
    it('Debe mostrar la lista de proveedores, luego mostrar un modal con los detalles de proveedores', () => {
  
      cy.visit('/dashboard');
      cy.contains('p', "Configuración").click();
      cy.wait(3000);
      cy.get('[href="/dashboard/settings/providers"]').click();
      cy.wait(3000);
      cy.get('.text-3xl').should('contain', 'Lista');
      cy.wait(3000);
      cy.get(':nth-child(2) > .text-right > [aria-label="Ver detalles"]').first().click();
      cy.wait(3000);
    });
  
    it('Debe cargar correctamente el formulario de proveedor', () => {
        cy.visit('/dashboard/settings/providers');
        cy.url().should('include', '/dashboard/settings/providers');

        cy.get('button').contains('Agregar').should('be.visible').click();
        cy.wait(3000);
        // Verificar que el título del formulario esté presente
        cy.get('h2').should('contain', 'Nuevo Proveedor');
    
        // Verificar los campos de entrada
        cy.get('input[name="businessName"]').should('be.visible');
        cy.get('input[name="description"]').should('be.visible');
        cy.get('input[name="phoneNumber"]').should('be.visible');
        cy.get('input[name="ruc"]').should('be.visible');
        
      });
    
      it('Debe crear un nuevo proveedor con datos aleatorios', () => {
        cy.visit('/dashboard/settings/providers/register');
        cy.wait(3000);
        const random = () => Math.random().toString(36).substring(2, 8); // genera 6 caracteres random

        const randomBusinessName = `Proveedor-${random()}`;
        const randomDescription = `Descripción-${random()}`;
        const randomPhoneNumber = `+595971${Math.floor(100000 + Math.random() * 900000)}`;
        const randomRuc = `${Math.floor(1000000 + Math.random() * 900000)}-1`;
    
        // Completar el formulario con los valores aleatorios
        cy.get('input[name="businessName"]').type(randomBusinessName);
        cy.get('input[name="description"]').type(randomDescription);
        cy.get('input[name="phoneNumber"]').type(randomPhoneNumber);
        cy.get('input[name="ruc"]').type(randomRuc);
    
        // Enviar el formulario
        cy.get('button[type="submit"]').click();
    
        // Verificar que la notificación de éxito aparece
        cy.contains('Proveedor creado').should('be.visible');
    
        // Verificar que redirige al listado de proveedores
        cy.url().should('include', '/dashboard/settings/providers');
      });
    
      it('Debe mostrar mensaje de error para inputs inválidos', () => {
        cy.visit('/dashboard/settings/providers/register');
        cy.wait(3000);
        // Dejar los campos vacíos y enviar el formulario
        cy.get('button[type="submit"]').click();
    
        // Verificar los mensajes de error
        cy.get('p.text-red-500').should('contain', 'La descripción es obligatoria'); 
      });
    
      it('should update an existing provider with random data', () => {
        // Navegar a la página de edición de proveedor
        cy.visit(`/dashboard/settings/providers/update/15`);
        cy.wait(3000);
    
        // Verificar que el formulario esté en modo edición
        cy.get('h2').should('contain', 'Editar Proveedor');
    
        const random = () => Math.random().toString(36).substring(2, 8); // genera 6 caracteres random

        const randomBusinessName = `Proveedor-${random()}`;
        const randomDescription = `Descripción-${random()}`;
        const randomPhoneNumber = `+595971${Math.floor(100000 + Math.random() * 900000)}`;
        const randomRuc = `${Math.floor(1000000 + Math.random() * 900000)}-1`;
    
        // Completar los campos de formulario con nuevos datos aleatorios
        cy.get('input[name="businessName"]').clear().type(randomBusinessName);
        cy.get('input[name="description"]').clear().type(randomDescription);
        cy.get('input[name="phoneNumber"]').clear().type(randomPhoneNumber);
        cy.get('input[name="ruc"]').clear().type(randomRuc);
    
        // Enviar el formulario
        cy.get('button[type="submit"]').click();
    
        // Verificar que la notificación de éxito aparece
        cy.contains('Proveedor actualizado').should('be.visible');
    
        // Verificar que redirige al listado de proveedores
        cy.url().should('include', '/dashboard/settings/providers');
      });
    
      it('Debe navegar de vuelta a la lista de proveedores al hacer clic en Cancela', () => {
        cy.visit('/dashboard/settings/providers/register');
        cy.wait(3000);
        // Hacer clic en el botón de Cancelar
        cy.get('button[type="button"]').should('contain', 'Cancelar').click();
    
        // Verificar que redirige al listado de proveedores
        cy.url().should('include', '/dashboard/settings/providers');
      });
     
});
