describe("Límites en los selectores de fecha en facturas", () => {
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
        cy.wait(3000);
        cy.visit("/dashboard/invoices");
        cy.url().should("include", "/dashboard/invoices");
    });

    it("Debe corregir fechas fuera del rango permitido", () => {
        // Límite inferior
        const fechaMuyBaja = "1500-01-07";
        const fechaBajaTimestamp = new Date(fechaMuyBaja).getTime();

        cy.get("#startDate")
            .clear({ force: true })
            .type(fechaMuyBaja, { force: true })
            .blur() // pierde el foco para activar validaciones
            .wait(1000)
            .invoke("val")
            .should("not.be.undefined")
            .then((valorIngresado) => {
                const valorDate = new Date(valorIngresado as string).getTime();
                expect(valorDate).to.be.greaterThan(fechaBajaTimestamp);
            });

        // Límite superior
        const fechaMuyAlta = "2500-01-07";
        const fechaAltaTimestamp = new Date(fechaMuyAlta).getTime();

        cy.get("#endDate")
            .clear({ force: true })
            .type(fechaMuyAlta, { force: true })
            .blur() // pierde el foco para activar validaciones
            .wait(1000)
            .invoke("val")
            .should("not.be.undefined")
            .then((valorIngresado) => {
                const valorDate = new Date(valorIngresado as string).getTime();
                expect(valorDate).to.be.lessThan(fechaAltaTimestamp);
            });
    });
});
