describe("ServiceTypeList", () => {
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
        cy.url().should("include", "/dashboard/settings/service-types");
        cy.wait(5000);
    });

    it("Debe mostrar la lista de tipos de servicio", () => {
        cy.get("h2").contains("Tipos de Servicio");
        cy.wait(10000);
        cy.get("table").should("exist");
        cy.get("thead").should("contain.text", "Nombre");
        cy.get("tbody tr").should("have.length.greaterThan", 0);
        cy.get("p").should("not.contain", "Error");
    });

    it('Debe buscar tipos de servicio por "consulta"', () => {
        cy.get('input[placeholder="Buscar tipo de servicio..."]').clear().type("consulta");
        cy.wait(20000); // tiempo para debounce, carga de resultados y animaciones

        cy.get("tbody tr").should("have.length.greaterThan", 0);

        cy.get("tbody tr").each(($row) => {
            cy.wrap($row).within(() => {
                cy.get("td").then(($tds) => {
                    const text = $tds.text().toLowerCase();
                    expect(text).to.include("consulta");
                });
            });
        });
    });
});
