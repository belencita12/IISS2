describe("Registro de Cita", () => {
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
        });
        cy.visit("/dashboard/appointment/register");
        cy.url().should("include", "/dashboard/appointment/register");
    });

    it("Debe registrar una cita con mascota Coni, empleado, un servicio, una fecha futura y con detalles", () => {
        /*
        cy.get('input[placeholder="Buscar Mascota..."]').type("Coni");
        cy.wait(20000);  // Espera a que se cargue la lista de mascotas
        cy.contains('[role="option"]', "Coni").click();

        cy.get('input[placeholder="Buscar empleado..."]').type("Bryan");
        cy.wait(20000);  // Espera a que se cargue la lista de empleados
        cy.contains('[role="option"]', "Bryan").click();
        cy.wait(1000);

        cy.get('body').then($body => {
            // Intento 1: Buscar por data-value o SelectTrigger
            if ($body.find('[class*="SelectTrigger"]').length > 0) {
                cy.get('[class*="SelectTrigger"]').first().click({ force: true });
            }
            // Intento 2: Buscar por placeholder
            else if ($body.find('*[placeholder="Selecciona un servicio"]').length > 0) {
                cy.get('*[placeholder="Selecciona un servicio"]').click({ force: true });
            }
            else {
                cy.get('div, button').contains('Selecciona un servicio').click({ force: true });
            }
        });

        cy.wait(1000);

        // Intentar seleccionar Consulta de varias maneras
        cy.get('body').then($body => {
            if ($body.find('[class*="SelectContent"] [class*="SelectItem"]').length > 0) {
                cy.get('[class*="SelectContent"] [class*="SelectItem"]').contains('Consulta').click({ force: true });
            } else if ($body.find('[role="option"]').length > 0) {
                cy.get('[role="option"]').contains('Consulta').click({ force: true });
            } else {
                cy.contains('Consulta').click({ force: true });
            }
        });*/

        cy.get('input[type="date"]').then(($input) => {
            const descriptor = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
            );

            if (descriptor && descriptor.set) {
                const nativeInputValueSetter = descriptor.set;

                const date = new Date();
                date.setDate(date.getDate() + 1);
                const formattedDate = date.toISOString().split("T")[0];

                nativeInputValueSetter.call($input[0], formattedDate);
                $input[0].dispatchEvent(new Event("input", { bubbles: true }));
                $input[0].dispatchEvent(new Event("change", { bubbles: true }));
            } else {
                throw new Error("No se pudo obtener el setter de valor para inputs de tipo date.");
            }
        });

        cy.wait(25000);
        // Verificar que el botón de "Registrar Cita" esté habilitado y hacer clic
        cy.get("button").contains("Registrar Cita").should("not.be.disabled").click();

        // Verificar redirección al listado de citas
        cy.url({ timeout: 10000 }).should("include", "/dashboard/appointment");
        cy.contains("Cita registrada con éxito");
    });

})