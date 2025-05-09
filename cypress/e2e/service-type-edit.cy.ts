describe("Edición de Tipo de Servicio", () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A"),
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(5000);
            cy.url().should("include", "/dashboard");
        });
        cy.visit("/dashboard/settings/service-types");
    });

    it("Debe navegar al formulario de edición desde el botón de lápiz", () => {
        cy.get("table tbody tr").first().within(() => {
            cy.get("button").eq(1).click();
        });

        cy.url().should("match", /\/dashboard\/settings\/service-types\/\d+\/edit$/);
        cy.get("h1").should("contain", "Actualizar Tipo de Servicio");
    });

    it("Debe editar un tipo de servicio correctamente", () => {
        cy.get("table tbody tr").first().within(() => {
            cy.get("button").eq(1).click(); // ícono de lápiz
        });

        cy.url().should("match", /\/dashboard\/settings\/service-types\/\d+\/edit$/);

        const newName = `Servicio Editado ${Date.now()}`;
        const newSlug = `servicio-editado-${Date.now()}`;

        cy.get('input[name="name"]').clear().type(newName);
        cy.get('input[name="slug"]').clear().type(newSlug);
        cy.get('textarea[name="description"]').clear().type('Esta es una descripción modificada con suficiente texto.');

        cy.get('#durationMin').clear().type('60');
        cy.get('#_price').clear().type('75000');
        cy.get('#_iva').clear().type('5');
        cy.get('#cost').clear().type('35000');
        cy.get('#maxColabs').clear().type('4');

        cy.get('button[type="submit"]').contains('Actualizar').click();
        cy.contains('Tipo de servicio actualizado con éxito', { timeout: 20000 }).should('be.visible');
        cy.url().should("include", "/dashboard/settings/service-types");
    });

    it("Debe volver al listado si se hace clic en 'Cancelar'", () => {
        cy.get("table tbody tr").first().within(() => {
            cy.get("button").eq(1).click();
        });

        cy.url().should("match", /\/dashboard\/settings\/service-types\/\d+\/edit$/);
        cy.contains("button", "Cancelar").click();
        cy.url().should("include", "/dashboard/settings/service-types");
    });
});
