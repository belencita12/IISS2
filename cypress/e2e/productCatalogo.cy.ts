describe("Catalogo y detalle de productos de catalogo", () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD"),
    };

    beforeEach(() => {
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
        });

        cy.visit("/user-profile");
        cy.contains("Ver más", { timeout: 10000 }).click();
        cy.url({ timeout: 10000 }).should("include", "/user-profile/product");

        cy.get("div.animate-pulse", { timeout: 15000 }).should("not.exist");
    });

    it("Filtra productos por nombre y navega al detalle", () => {
        cy.get("input[placeholder='Buscar...']", { timeout: 20000 })
            .should("be.visible")
            .clear()
            .type("perro", { delay: 1000 });

        cy.wait(3000); // esperar debounce

        cy.contains("Ver detalles").click();
        cy.get("h1").should("contain.text", "perro");
        cy.wait(3000);
    });
});