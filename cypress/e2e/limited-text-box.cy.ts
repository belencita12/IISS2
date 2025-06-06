describe("Validación de límite en input de búsqueda de cliente", () => {
    const SESSION_KEY = "adminSessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A"),
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.url().should("include", "/dashboard");
        });

        cy.visit("/dashboard");
        cy.wait(4000);
        cy.visit("/dashboard/appointment");
        cy.url().should("include", "/dashboard/appointment");
        cy.wait(3000);
    });

    it("Debe aceptar solo 50 caracteres y terminar en 'x'", () => {
        const alfabetoDoble = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"; // 52 caracteres

        cy.get('input[placeholder="Buscar por nombre o ruc del cliente..."]')
            .should("be.visible")
            .clear()
            .type(alfabetoDoble)
            .invoke("val")
            .should("have.length", 50)
            .and("match", /x$/);
    });
});
