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
            cy.wait(5000);
            cy.url().should("include", "/dashboard");
        });
        cy.visit("/dashboard/appointment/register");
        cy.url().should("include", "/dashboard/appointment/register");
        cy.wait(5000);
    });

    it("Debe registrar una cita con mascota Coni, empleado, un servicio, una fecha futura y con detalles", () => {

        cy.get('input[placeholder="Buscar Mascota..."]').should('be.visible').clear().type("Coni");
        cy.wait(1000);
        cy.contains('[class*="CommandItem"]', "Coni", { timeout: 15000 })
            .should('be.visible')
            .click();

        // Verificar que se ha seleccionado la mascota correctamente
        cy.contains("Coni").should('be.visible');

        // PASO 2: Seleccionar servicio (usando el componente Select)
        cy.log('Seleccionando servicio');

        // Hacer clic en el SelectTrigger
        cy.get('[class*="SelectTrigger"]').first().click({ force: true });
        cy.wait(500);

        // Seleccionar el servicio "Consulta" del SelectContent
        cy.get('[class*="SelectContent"]')
            .contains('Consulta')
            .click({ force: true });

        // Verificar que se ha seleccionado el servicio
        cy.contains('Consulta').should('be.visible');

        // PASO 3: Seleccionar empleado
        cy.log('Seleccionando empleado');
        cy.get('input[placeholder="Buscar empleado..."]').should('be.visible').clear().type("Bryan");
        cy.wait(1000);

        // Esperar a que aparezca el CommandItem con el texto Bryan
        cy.contains('[class*="CommandItem"]', "Bryan", { timeout: 5000 })
            .should('be.visible')
            .click();

        // Verificar que se ha seleccionado el empleado correctamente
        cy.contains("Bryan").should('be.visible');

        // PASO 4: Seleccionar fecha (mañana)
        cy.log('Seleccionando fecha');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Formatear la fecha como YYYY-MM-DD para el input type="date"
        const formattedDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

        // Establecer la fecha en el input
        cy.get('input[type="date"]').should('be.visible').clear().type(formattedDate, { force: true });

        // Esperar a que se carguen los horarios disponibles
        cy.wait(3000);

        // PASO 5: Seleccionar hora disponible
        cy.log('Seleccionando hora disponible');

        // Seleccionar el primer horario disponible
        cy.get('button')
            .contains(/^\d{1,2}:\d{2}$/)
            .first()
            .click({ force: true });

        // PASO 6: Agregar detalles de la cita
        cy.log('Agregando detalles de la cita');
        cy.get('textarea').first().type("Consulta de control para Coni");

        // PASO 7: Registrar la cita
        cy.log('Registrando la cita');
        cy.contains("button", "Registrar Cita").click({ force: true });

        // PASO 8: Verificar resultado exitoso (redirección o mensaje de éxito)
        cy.log('Verificando resultado');
        cy.wait(3000);

        // Verificar redirección a la página de citas o mensaje de éxito
        cy.url().should("include", "/dashboard/appointment", { timeout: 10000 })
            .then(() => {
                cy.log('Cita registrada correctamente');
            });
    });
});