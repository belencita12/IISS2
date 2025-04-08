describe('Crear Fabricantes Vacunas', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A")
    };
    let uniqueName = "";

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(20000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard/vaccine/manufacturer/new');
        cy.url().should('include', '/dashboard/vaccine/manufacturer/new');
    });

    it('Los botones para interactuar con el formulario deden ser visibles', () => {
        cy.get('button').contains('Crear').should('be.visible');
        cy.get('button').contains('Cancelar').should('be.visible');
    });    

    it('Debe mostrar mensajes de error cuando se intenta enviar el formulario vacío', () => {
        cy.get('button').contains('Crear').click();
        cy.contains('El nombre debe tener al menos 3 caracteres').should('be.visible');
        cy.wait(2000);
    });

    it('Debe crear un nuevo fabricante con datos validos', () => {
        const randomNumber = Math.floor(Math.random() * 100000);
        uniqueName = `FabricanteTest${randomNumber}`;
        cy.get('input[placeholder="Nombre del fabricante"]').type(`${uniqueName}`);
        cy.get('button').contains('Crear').click();
        cy.wait(2000);
        cy.visit('/dashboard/vaccine/manufacturer');
    });

    // it('Intentar crear un fabricante de vacunas con un nombre repetido', () => {
    //     cy.get('input[placeholder="Nombre del fabricante"]').type(`${uniqueName}`);
    //     cy.get('button').contains('Crear').click();
    //     cy.wait(8000);
    //     cy.contains(`Error: 400`).should('be.visible');
    // });

});
