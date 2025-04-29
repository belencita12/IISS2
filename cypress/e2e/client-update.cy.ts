describe('ClientListSection', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email:  Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A")
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(5000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard/clients');
        cy.url().should('include', '/dashboard/clients');
        cy.wait(10000);
    });

    it('Debe permitir editar la información de un cliente', () => {
        cy.get('[aria-label="Editar"]')
            .first()
            .click();

        // Verificar que la URL de edición incluye el ID del cliente
        cy.url().should('match', /\/dashboard\/clients\/\d+\/edit/);
        cy.wait(5000);
        // Editar los campos del formulario (ajustar según tus campos reales)
        cy.get('input[name="name"]').clear().type('Editado');
        cy.get('input[name="email"]').clear().type('cliente@example.com');
        cy.get('input[name="ruc"]').clear().type('4562314-4'); 
        
        // Guardar los cambios
        cy.get('button').contains('Guardar').click();
        cy.wait(7000);
        
        // Verificar que vuelve al listado de clientes o muestra un mensaje de éxito
        cy.url().should('include', '/dashboard/clients');
        cy.contains('Cliente actualizado con éxito');

        // Verificar que los datos editados están en la tabla
        cy.get('table').should('contain', 'Editado');
        cy.get('table').should('contain', 'cliente@example.com');
    });

    it('Debe mostrar error si el RUC tiene un formato inválido', () => {
        
        // Editar un cliente con un RUC en formato incorrecto
        cy.get('[aria-label="Editar"]').first().click();
        cy.url().should('match', /\/dashboard\/clients\/\d+\/edit/);
        cy.wait(4000);
        cy.get('input[name="name"]').clear().type('Nombre Editado');
        cy.get('input[name="email"]').clear().type('cliente.editado@example.com');
        cy.get('input[name="ruc"]').clear().type('514291');

        // Intentar guardar los cambios
        cy.get('button').contains('Guardar').click();
        cy.wait(5000);

        // Verificar que se muestre un mensaje de error por RUC inválido
        cy.contains('RUC inválido').should('be.visible');
    });

    it('Debe mostrar error si el RUC ya está en uso', () => {
        // Editar un cliente con un RUC ya registrado
        cy.get('[aria-label="Editar"]').first().click();
        cy.url().should('match', /\/dashboard\/clients\/\d+\/edit/);
        cy.wait(5000);

        cy.get('input[name="name"]').clear().type('Nombre Editado');
        cy.get('input[name="email"]').clear().type('cliente.editado@example.com');
        // Ingresar un RUC ya en uso
        cy.get('input[name="ruc"]').clear().type('1756033-1');
        cy.get('button').contains('Guardar').click();
        cy.wait(5000);

        // Verificar que se muestre un mensaje de error por RUC ya en uso
        cy.contains('uso').should('be.visible');
    });
});

