describe("Registro de Tipo de Servicio", () => {
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
        cy.contains("button", "Agregar").click();
        cy.url().should("include", "/dashboard/settings/service-types/register");
    });

    it('Debe registrar un nuevo tipo de servicio correctamente', () => {
        const randomId = Math.floor(Math.random() * 10000);
        const serviceName = `Servicio de prueba ${randomId}`;
        const serviceSlug = `servicio-prueba-${randomId}`;

        cy.get('input[name="name"]').type(serviceName);
        cy.get('input[name="slug"]').type(serviceSlug);
        cy.get('textarea[name="description"]').type('Descripción detallada del servicio de prueba. Este es un texto que supera los 10 caracteres requeridos.');

        cy.get('#durationMin').clear().type('30');
        cy.get('#_price').clear().type('50000');
        cy.get('#_iva').clear().type('5');
        cy.get('#cost').clear().type('25000');
        cy.get('#maxColabs').clear().type('2');
        cy.get('button[type="submit"]').contains('Registrar').click();
        cy.contains('Tipo de servicio creado con éxito', { timeout: 20000 }).should('be.visible');
        cy.url().should('include', '/dashboard/settings/service-types');
    });

    it('Debe validar campos obligatorios', () => {
        cy.get('button[type="submit"]').contains('Registrar').click();
        // Verificar mensajes de error
        cy.contains('El nombre es obligatorio').should('be.visible');
        cy.contains('El identificador es obligatorio').should('be.visible');
        cy.contains('La descripción debe tener al menos 10 caracteres').should('be.visible');
        cy.url().should('include', '/dashboard/settings/service-types/register');
    });

    it("Debe navegar correctamente si se hace clic en 'Cancelar'", () => {
        // Haz clic en el botón de cancelar
        cy.contains("button", "Cancelar").click();
        cy.url().should("include", "/dashboard/settings/service-types");
    });
});
