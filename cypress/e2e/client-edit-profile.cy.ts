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
        cy.contains('Mis mascotas')
            .should('have.class', 'bg-white')
            .and('have.class', 'text-violet-600');
        cy.contains('Lista de mascotas').should('exist');
        cy.wait(10000);
    });

    it('Debe mostrar la pestaña "Mis Citas" al hacer clic', () => {
        cy.contains('Mis citas').click();
        cy.wait(1000);

        cy.contains('Mis citas')
            .should('have.class', 'bg-white')
            .and('have.class', 'text-violet-600');
        cy.wait(10000);

        cy.contains('Mis citas').should('exist');
    });

    it('Debe mostrar la pestaña "Mis datos" al hacer clic', () => {
        cy.contains('Mis datos').click();
        cy.wait(1000);

        cy.contains('Mis datos')
            .should('have.class', 'bg-white')
            .and('have.class', 'text-violet-600');
        cy.wait(20000);

        cy.contains('Annia Benítez').should('exist');
    });
    it('Debe permitir editar los datos del cliente', () => {
        cy.contains('Mis datos').click();
        cy.wait(3000);

        cy.contains('Editar').click();

        // Editar campos
        cy.get('input[placeholder="Ingrese el nombre"]')
            .clear()
            .type('Annia Benítez H.');

        cy.get('input[placeholder="Ingrese el número de teléfono"]')
            .clear()
            .type('+595985518020');

        cy.get('input[placeholder="Ingrese la dirección"]')
            .clear()
            .type('Obligado a veces Encarnación zona uni');

        // Confirmar cambios
        cy.contains('Guardar').click();

        cy.wait(20000);
    });

    it('Debe mostrar mensajes de validación si se intenta guardar con campos vacíos', () => {
        cy.contains('Mis datos').click();
        cy.wait(3000);

        cy.contains('Editar').click();

        // Vaciar los campos editables
        cy.get('input[placeholder="Ingrese el nombre"]').clear();
        cy.get('input[placeholder="Ingrese el número de teléfono"]').clear();
        cy.get('input[placeholder="Ingrese la dirección"]').clear();


        cy.contains('Guardar').click();
        cy.contains('El nombre completo es obligatorio').should('exist');
        cy.contains('El número de telefono es obligatorio').should('exist');

    });
});