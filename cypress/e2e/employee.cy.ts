describe("Formulario de Edición de Empleados", () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A"),
    };

    const RUC_EXISTENTE = "12345678-0";
    const EMAIL_EXISTENTE = "admin@gmail.com";
    const NEW_PHONE = `+595971${Math.floor(100000 + Math.random() * 900000)}`;

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
        });

        cy.visit("/dashboard");
        cy.contains("p", "Empleados").click();
        cy.intercept("GET", "/employee/*").as("getEmployee");
        cy.get('[aria-label="Editar"]').first().click();
        cy.wait("@getEmployee");
        cy.contains("Actualizar Empleado").should("be.visible");
    });

    it("Debe mostrar errores al borrar campos requeridos y enviar", () => {
        // Limpiar los campos obligatorios
        cy.get('input[placeholder="Nombre completo"]').clear();
        cy.get('input[placeholder="Correo electrónico"]').clear();
        cy.get('input[placeholder="Teléfono"]').clear();

        // Enviar el formulario
        cy.get("button").contains("Actualizar Empleado").click();

        // Verificar que los mensajes de error estén visibles
        cy.contains("El nombre es obligatorio").should("be.visible");
        cy.contains("Correo inválido").should("be.visible");
        cy.contains("El teléfono debe iniciar con +595 y tener 9 dígitos").should("be.visible");
    });

    it("Debe mostrar error si se ingresa un RUC con formato inválido", () => {
        cy.get('input[placeholder="Ej: 12345678-0"]').clear().type("12345");
        cy.get('input[placeholder="Teléfono"]').clear().type(NEW_PHONE);
        cy.get("button").contains("Actualizar Empleado").click();
        cy.wait(5000);
        cy.contains("El RUC debe tener de 6 a 8 dígitos").should("be.visible");
    });

    it("Debe mostrar error si se ingresa un RUC ya registrado", () => {
        cy.get('input[placeholder="Ej: 12345678-0"]').clear().type(RUC_EXISTENTE);
        cy.get('input[placeholder="Teléfono"]').clear().type(NEW_PHONE);
        cy.get("button").contains("Actualizar Empleado").click();
        cy.wait(6000);
        cy.contains("uso").should("be.visible");
    });

    it("Debe mostrar error si se ingresa un email ya registrado", () => {
        cy.get('input[placeholder="Correo electrónico"]').clear().type(EMAIL_EXISTENTE);
        cy.get('input[placeholder="Teléfono"]').clear().type(NEW_PHONE);
        cy.get("button").contains("Actualizar Empleado").click();
        cy.wait(5000);
        cy.contains("uso").should("be.visible");
    });

    it("Debe actualizar el teléfono correctamente", () => {
        cy.get('input[placeholder="Teléfono"]').clear().type(NEW_PHONE);
        cy.get("button").contains("Actualizar Empleado").click();
        cy.wait(3000);
        cy.contains("Empleado actualizado correctamente", { timeout: 10000 }).should("be.visible");
    });
});
