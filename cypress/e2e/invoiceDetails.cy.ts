describe('Detalle de la Factura', () => {
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

    it('Debe mostrar el detalle de la factura con ID 18', () => {

        cy.visit('/dashboard/invoices/18', { timeout: 10000 });
        cy.url().should('include', '/dashboard/invoices/18');

        // Esperar que la página se cargue completamente (sin animación de carga)
        cy.get("div.animate-pulse", { timeout: 20000 }).should("not.exist");

        // Verificar que se muestra el título de la factura
        cy.get('h1', { timeout: 10000 }).should('contain', 'Factura');

        // Verificar que los detalles de la factura están presentes
        cy.get("body").then(($body) => {
            if ($body.find("div.bg-card").length > 0) {
                // Si hay un contenedor de detalles (como en ProductCatalog)
                cy.get("div.bg-card", { timeout: 20000 })
                    .should("be.visible")
                    .within(() => {
                        // Ajusta las validaciones según los datos esperados de la factura
                        cy.get("p").should("exist"); // Ejemplo: verifica que hay texto
                    });
            } else {
                // Si no hay contenedor, verifica un mensaje de error o datos alternativos
                cy.contains("p", "No se encontraron detalles", { timeout: 20000 }).should("be.visible");
            }
        });
    });
});