describe('ProfileTabs - Vista de cliente en /user-profile', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD")
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(3000);
        });
        cy.visit('/user-profile');
        cy.url().should('include', '/user-profile');
        cy.wait(3000);
    });

    it('Debe mostrar por defecto la pestaña "Mis Mascotas"', () => {
        cy.contains('Mis Mascotas')
            .should('have.class', 'bg-white')
            .and('have.class', 'text-violet-600');
        cy.contains('Mascotas Registradas').should('exist');
        cy.wait(10000);
    });

    it('Debe mostrar la pestaña "Mis Citas" al hacer clic', () => {
        cy.contains('Mis Citas').click();
        cy.wait(1000);

        cy.contains('Mis Citas')
            .should('have.class', 'bg-white')
            .and('have.class', 'text-violet-600');
        cy.wait(10000);

        cy.contains('Citas Agendadas').should('exist');
    });

    it('Debe mostrar la pestaña "Mis Datos" al hacer clic', () => {
        cy.contains('Mis Datos').click();
        cy.wait(1000);

        cy.contains('Mis Datos')
            .should('have.class', 'bg-white')
            .and('have.class', 'text-violet-600');
        cy.wait(20000);

        cy.contains('Jose Valgaba').should('exist');
    });
    it('Debe permitir editar los datos del cliente', () => {
        cy.contains('Mis Datos').click();
        cy.wait(3000);

        cy.contains('Editar perfil').click();

        // Editar campos
        cy.get('input[placeholder="Tu nombre completo"]')
            .clear()
            .type('Jose Valgaba Actualizado');

        cy.get('input[placeholder="Tu número de teléfono"]')
            .clear()
            .type('+595981123456');

        cy.get('input[placeholder="Tu dirección"]')
            .clear()
            .type('Av. Siempre Viva 123');

        // Confirmar cambios
        cy.contains('Guardar').click();

        cy.wait(20000);
    });

    it('Debe mostrar mensajes de validación si se intenta guardar con campos vacíos', () => {
        cy.contains('Mis Datos').click();
        cy.wait(3000);

        cy.contains('Editar perfil').click();

        // Vaciar los campos editables
        cy.get('input[placeholder="Tu nombre completo"]').clear();
        cy.get('input[placeholder="Tu número de teléfono"]').clear();
        cy.get('input[placeholder="Tu dirección"]').clear();


        cy.contains('Guardar').click();
        cy.contains('El nombre completo es obligatorio').should('exist');
        cy.contains('El número de telefono es obligatorio').should('exist');

    });
});
