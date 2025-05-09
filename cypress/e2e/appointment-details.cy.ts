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
    it('Debe mostrar la pestaña "Mis Citas" y permitir ver detalles de una cita', () => {
    cy.contains('Mis Citas').click();
    cy.wait(1000);

    cy.contains('Mis Citas')
        .should('have.class', 'bg-white')
        .and('have.class', 'text-violet-600');

    cy.contains('Citas Agendadas').should('exist');
    cy.wait(20000);

    cy.get(':nth-child(2) > .text-right > [aria-label="Ver detalles"]').first().click();
    cy.wait(20000);
    cy.url().should('match', /\/user-profile\/appointment\/\d+$/);
});



});
