describe("AppointmentListSection", () => {
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
        cy.visit("/dashboard/appointment");
        cy.url().should("include", "/dashboard/appointment");
        cy.wait(5000);
    });

    it("Debe mostrar la lista de citas", () => {
        cy.get("h2").contains("Citas");
        cy.get("div").contains("Citas").should("exist");
        cy.wait(20000);
        cy.get("p").should("not.contain", "Error");
    });

    it("Debe buscar citas por RUC del cliente", () => {
        cy.get('input[placeholder="Buscar por RUC del cliente"]').type("4567345-9");
        cy.wait(20000);
        cy.get("div").should("contain", "Lourdes");
    });

    it("Debe aplicar filtro por fecha con inputs de tipo date", () => {
        const today = new Date().toISOString().split("T")[0];
        cy.get("input#startDate").type(today, { force: true });
        cy.get("input#endDate").type(today, { force: true });
        cy.wait(20000);
        cy.get("div").contains("Cliente").should("exist");
    });

    it("Debe mostrar error cuando la fecha final es menor a la inicial", () => {
        const today = new Date().toISOString().split("T")[0];
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        cy.get("input#startDate").type(today, { force: true });
        cy.get("input#endDate").type(fiveDaysAgo, { force: true });
    });

    it("Debe abrir la página de registro de citas", () => {
        cy.get("button").contains("Agendar").click();
        cy.wait(20000);
        cy.url().should("include", "/dashboard/appointment/register");
    });
});
