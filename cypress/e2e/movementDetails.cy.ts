describe('Detalle del Movimientos', () => {
    const SESSION_KEY = "sessionToken";;

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        const sessionToken: string = Cypress.env(SESSION_KEY);
        if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);
    });

    it('login', () => {

        // establecer sesión
        const USER = {
            email: Cypress.env("USER_EMAIL_A"),
            password: Cypress.env("USER_PASSWORD_A")
        };

        cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);

    })
    it('Debe mostrar el listado de Movimientos', () => {

        cy.visit('/dashboard');

        cy.contains('p', "Movimientos").click();
        cy.wait(3000);
        cy.get('.text-2xl').should('contain', 'Movimientos');


    });

    it('Debe ingresar al detalle del movimiento de la lista', () => {
        cy.visit('/dashboard/movement');

        cy.get('div.cursor-pointer').eq(1).click();

        // Verifica que ahora está en el detalle del movimiento
        cy.url().should('include', '/dashboard/movement/');
        cy.get('h1').should('contain', 'Movimiento');
    });
});
