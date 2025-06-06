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
        cy.contains('Mascotas registradas').should('exist');
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

    it('Debe mostrar la pestaña "Mis Datos" al hacer clic', () => {
        cy.contains('Mis datos').click();
        cy.wait(1000);

        cy.contains('Mis datos')
            .should('have.class', 'bg-white')
            .and('have.class', 'text-violet-600');
        cy.wait(20000);

        cy.contains('Annia').should('exist');
    });

    it('Debe mostrar la sección de Productos recomendados', () => {
    cy.wait(8000);
     cy.contains('Productos veterinarios').should('be.visible');
    });
});