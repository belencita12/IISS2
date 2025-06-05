describe("Registro completo de cita (cliente)", () => {
    const SESSION_KEY = "clientSession";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A"),
    };

    beforeEach(() => {
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
        });
        cy.visit("/dashboard/appointment");
    });

    it("Debe permitir buscar citas por RUC del cliente", () => {

        cy.get("input[placeholder*='nombre o ruc']").type("1234567-8"); // ← usa un RUC válido del sistema
        cy.wait(10000);

        cy.get("[data-testid='appointment-card']").should("exist"); // ajusta según tu card
    });

    it("Debe encontrar coincidencias sin importar tildes o mayúsculas", () => {
        cy.get("input[placeholder*='nombre o ruc']").type("josé"); // en base de datos: "José García"
        cy.wait(1000);

        cy.get("[data-testid='appointment-card']").should("exist");
        cy.get("[data-testid='appointment-card']").first().should("contain.text", "Jose Valgaba");
    });

    it("Debe esperar antes de buscar por debounce", () => {

        cy.intercept("GET", "**/appointment**").as("fetchAppointments");

        cy.get("input[placeholder*='nombre o ruc']").type("carlos");

        // Espera a que se active el debounce (500ms) y se dispare el fetch
        cy.wait("@fetchAppointments").its("response.statusCode").should("eq", 200);
    });

    it("Debe tener el placeholder correcto en el buscador", () => {

        cy.get("input[placeholder]")
            .should("exist")
            .and("have.attr", "placeholder", "Buscar por nombre o ruc del cliente");
    });




});
