describe('Registro de Vacunación en Configuración', () => {
    const SESSION_KEY = "vaccineSessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A"),
    };

    // Datos de prueba
    const CLIENT_SEARCH = "Jose";
    const PET_SEARCH = "Brucito";
    const VACCINE_SEARCH = "Nobivac";
    const DOSE = "0.5";
    const INVALID_DOSE = "0";
    const APPLICATION_DATE = "2023-04-18T10:00";
    const EXPECTED_DATE = "2024-04-20T10:00";
    const INVALID_EXPECTED_DATE = "2023-04-14T10:00"; // Anterior a APPLICATION_DATE

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
        });

        cy.visit("/dashboard/settings/vaccine-registry/new");
    });

    it('Debe completar el registro de vacunación correctamente', () => {
        // Interceptar las APIs
        cy.intercept("GET", "**/client*").as("searchClients");
        cy.intercept("GET", "**/pet*").as("searchPets");
        cy.intercept("GET", "**/vaccine*").as("searchVaccines");
        cy.intercept("POST", "**/vaccine-registry*").as("createVaccineRegistry");

        // Verificar que estamos en la página correcta
        cy.contains('h2', 'Nuevo Registro de Vacunación').should('be.visible');

        cy.get('input[placeholder*="Buscar por nombre o cédula"]').type(CLIENT_SEARCH);
        cy.wait("@searchClients").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        // Esperar a que la lista de opciones sea visible y seleccionar la primera opción
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(CLIENT_SEARCH)
            .click();

        cy.get('input[placeholder*="Buscar mascota"]').type(PET_SEARCH);
        cy.wait("@searchPets").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(PET_SEARCH)
            .click();

        cy.get('input[placeholder*="Buscar vacuna"]').type(VACCINE_SEARCH);
        cy.wait("@searchVaccines").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(VACCINE_SEARCH)
            .click();

        /* === PASO 4: Completar datos de vacunación === */
        cy.get('input[name="dose"]').type(DOSE);
        cy.get('input[name="applicationDate"]').type(APPLICATION_DATE);
        cy.get('input[name="expectedDate"]').type(EXPECTED_DATE);
        cy.contains('button', 'Registrar').click();
        cy.wait("@createVaccineRegistry").then((interception) => {
            expect(interception.response?.statusCode).to.oneOf([200, 201]);
        });
        cy.visit("/dashboard/settings");

    });

    it('Debe mostrar validación cuando faltan campos requeridos', () => {
        // Interceptar la API de búsqueda de clientes
        cy.intercept("GET", "**/client*").as("searchClients");

        cy.get('input[placeholder*="Buscar por nombre o cédula"]').type(CLIENT_SEARCH);
        cy.wait("@searchClients").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(CLIENT_SEARCH)
            .click();

        // Intentar enviar sin completar ningún campo
        cy.contains('button', 'Registrar').click();
        // Verificar mensajes de error
        cy.contains('La mascota es obligatoria').should('be.visible');
        cy.contains('La mascota es obligatoria').should('be.visible');
    });
    it('Debe mostrar validación cuando la dosis es 0', () => {
        // Interceptar las APIs
        cy.intercept("GET", "**/client*").as("searchClients");
        cy.intercept("GET", "**/pet*").as("searchPets");
        cy.intercept("GET", "**/vaccine*").as("searchVaccines");

        // Seleccionar cliente
        cy.get('input[placeholder*="Buscar por nombre o cédula"]').type(CLIENT_SEARCH);
        cy.wait("@searchClients").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(CLIENT_SEARCH)
            .click();

        // Seleccionar mascota
        cy.get('input[placeholder*="Buscar mascota"]').type(PET_SEARCH);
        cy.wait("@searchPets").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(PET_SEARCH)
            .click();

        // Seleccionar vacuna
        cy.get('input[placeholder*="Buscar vacuna"]').type(VACCINE_SEARCH);
        cy.wait("@searchVaccines").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(VACCINE_SEARCH)
            .click();

        // Completar datos de vacunación con dosis inválida
        cy.get('input[name="dose"]').clear().type(INVALID_DOSE);
        cy.get('input[name="applicationDate"]').type(APPLICATION_DATE);
        cy.get('input[name="expectedDate"]').type(EXPECTED_DATE);

        // Enviar formulario
        cy.contains('button', 'Registrar').click();

        // Verificar mensaje de error
        cy.contains('La dosis debe ser mayor a 0').should('be.visible');
        // Asegurarse de que no se envíe el formulario
        cy.url().should("include", "/dashboard/settings/vaccine-registry/new");
    });

    it('Debe mostrar validación cuando la fecha esperada es anterior a la fecha de aplicación', () => {
        // Interceptar las APIs
        cy.intercept("GET", "**/client*").as("searchClients");
        cy.intercept("GET", "**/pet*").as("searchPets");
        cy.intercept("GET", "**/vaccine*").as("searchVaccines");

        // Seleccionar cliente
        cy.get('input[placeholder*="Buscar por nombre o cédula"]').type(CLIENT_SEARCH);
        cy.wait("@searchClients").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(CLIENT_SEARCH)
            .click();

        // Seleccionar mascota
        cy.get('input[placeholder*="Buscar mascota"]').type(PET_SEARCH);
        cy.wait("@searchPets").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(PET_SEARCH)
            .click();

        // Seleccionar vacuna
        cy.get('input[placeholder*="Buscar vacuna"]').type(VACCINE_SEARCH);
        cy.wait("@searchVaccines").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div.absolute.z-50.w-full.bg-white.border.rounded.shadow.max-h-48.overflow-y-auto')
            .should('be.visible')
            .find('div.p-2.hover\\:bg-gray-100.cursor-pointer')
            .contains(VACCINE_SEARCH)
            .click();

        // Completar datos de vacunación con fecha esperada inválida
        cy.get('input[name="dose"]').type(DOSE);
        cy.get('input[name="applicationDate"]').type(APPLICATION_DATE);
        cy.get('input[name="expectedDate"]').type(INVALID_EXPECTED_DATE);

        // Enviar formulario
        cy.contains('button', 'Registrar').click();

        // Verificar mensaje de error
        cy.contains('La fecha esperada debe ser posterior a la fecha de aplicación').should('be.visible');
        // Asegurarse de que no se envíe el formulario
        cy.url().should("include", "/dashboard/settings/vaccine-registry/new");
    });
});