describe("ServiceTypeList - Ver Detalles", () => {
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
            cy.wait(10000);
        });

        cy.visit("/dashboard/settings/service-types");
        cy.url().should("include", "/dashboard/settings/service-types");
        cy.wait(10000);
    });

    it("Debe navegar al detalle desde el botón de ver (ojo)", () => {
        cy.get("table tbody tr").first().within(() => {
            cy.get("button").eq(0).click(); // primer botón es el ojo
        });

        cy.url().should("match", /\/dashboard\/settings\/service-types\/\d+$/);
        cy.get("h1").should("contain", "Detalle de Tipos de Servicios");
        cy.wait(2000);
    });

    it("Debe mostrar la información del tipo de servicio", () => {
        cy.get("table tbody tr").first().within(() => {
            cy.get("button").eq(0).click();
        });

        cy.url().should("match", /\/dashboard\/settings\/service-types\/\d+$/);

        cy.get("h1").should("contain", "Detalle de Tipos de Servicios");
        cy.wait(2000);
        cy.get("img").should("exist");
        cy.get("p").should("contain.text", "Gs").should("not.contain", "Error");
    });

    it('Debe volver al listado al hacer clic en "Volver"', () => {
        cy.get("table tbody tr").first().within(() => {
            cy.get("button").eq(0).click(); // botón de ver
        });
         cy.url().should("match", /\/dashboard\/settings\/service-types\/\d+$/);

        cy.get("h1").should("contain", "Detalle de Tipos de Servicios");
        cy.wait(2000);
        cy.get("button").contains("Volver").click();
        cy.url().should("include", "/dashboard/settings/service-types");
        cy.get("h2").should("contain", "Tipos de Servicio");
        cy.wait(10000);
    });
});
