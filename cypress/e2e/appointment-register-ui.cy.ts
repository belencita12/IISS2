describe("Registro completo de cita (cliente)", () => {
    const SESSION_KEY = "clientSession";
    const USER = {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD"),
    };

    beforeEach(() => {
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
        });
        cy.visit("/user-profile/appointment/register");
    });

    /*it("Debe registrar una cita completa exitosamente", () => {
        // === Mascota ===
        cy.get('button[role="combobox"]')
            .contains("Seleccionar")
            .click();

        cy.get('[role="dialog"]').last().within(() => {
            cy.get('input[placeholder*="nombre"]').type("Patroclo", { delay: 100 });
            cy.wait(1000);
            cy.get('[role="option"]').first().click();
        });

        // === Servicio ===
        cy.get('button[role="combobox"]')
            .contains("Debes seleccionar al menos un servicio")
            .click();

        cy.get('[role="dialog"]').last().within(() => {
            cy.get('input[placeholder*="nombre"]').type("consulta", { delay: 100 });
            cy.wait(1000);
            cy.get('[role="option"]').first().click();
        });

        // === Empleado ===
        cy.get('button[role="combobox"]')
            .contains("Seleccionar un empleado")
            .click();

        cy.get('[role="dialog"]').last().within(() => {
            cy.get('input[placeholder*="nombre"]').type("bry", { delay: 100 });
            cy.wait(1000);
            cy.get('[role="option"]').first().click();
        });

        // === Fecha ===
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formatted = tomorrow.toISOString().split("T")[0];
        cy.get('input[type="date"]').type(formatted);


        cy.get("button")
            .filter(":visible")
            .not("[disabled]")
            .contains(/^\d{2}:\d{2}$/) // texto con formato HH:mm
            .first()
            .click();

        // === Detalles ===
        cy.get("textarea").type("Mi mascota necesita atención urgente. llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");

        // === Agendar ===
        cy.contains("button", "Agendar", { timeout: 15000 })
            .should("be.visible")
            .and("not.be.disabled")
            .click();

        // === Validaciones ===
        cy.url({ timeout: 15000 }).should("include", "/user-profile");

    });*/

    it("Debe permitir seleccionar múltiples servicios", () => {
        // Abre el select de servicios
        cy.get('button[role="combobox"]')
            .contains("Debes seleccionar al menos un servicio")
            .click();

        cy.get('[role="dialog"]').last().within(() => {
            cy.get('input[placeholder*="nombre"]').type("consulta", { delay: 100 });
            cy.wait(1000);
            cy.get('[role="option"]').first().click();
        });

        // Vuelve a abrir el select para seleccionar otro servicio
        cy.get('button[role="combobox"]')
            .contains("Selecciona otro servicio")
            .click();

        cy.get('[role="dialog"]').last().within(() => {
            cy.get('input[placeholder*="nombre"]').clear().type("vacuna", { delay: 100 });
            cy.wait(1000);
            cy.get('[role="option"]').first().click();
        });

    });


    /*it("Debe permitir buscar y seleccionar una mascota", () => {
        cy.get('button[role="combobox"]').contains("Seleccionar").click();

        cy.get('[role="dialog"]').last().within(() => {
            cy.get('input[placeholder*="nombre"]').type("Patroclo", { delay: 100 });
            cy.wait(1000);
            cy.get('[role="option"]').first().click();
        });

        cy.get('button[role="combobox"]')
            .eq(0) // Primer combobox: mascota
            .should("contain.text", "Patroclo");

    });*/


    it("Debe tener diseño y clases consistentes en componentes clave", () => {
        // Contenedor general
        cy.get("form").should("exist").and("have.class", "space-y-8");

        // Verifica un componente con clase de diseño
        cy.get("div.bg-white.rounded-lg").should("exist").and("have.class", "shadow-sm");

        // Botones principales
        cy.get('button[type="submit"]').should("have.class", "bg-gradient-to-r");
        cy.get('button[type="button"]').should("have.class", "hover:bg-myPurple-disabled");
    });


    it("No debe permitir seleccionar horarios ocupados", () => {
    // === Empleado ===
    cy.get('button[role="combobox"]').eq(2).click(); // 0 = mascota, 1 = servicio, 2 = empleado

    cy.get('[role="dialog"]').last().within(() => {
        cy.get('input[placeholder*="nombre"]').type("bry", { delay: 100 });
        cy.get('[role="option"]').first().click();
    });

    // === Fecha dinámica: mañana ===
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    const formattedDate = tomorrow.toISOString().split("T")[0];

    cy.get('input[type="date"]').type(formattedDate);

    // === Esperar horario disponible (ej: 16:00)
    cy.get("button")
        .filter(":visible")
        .not("[disabled]")
        .contains("16:00", { timeout: 10000 })
        .should("exist");

    // === Validar que un horario ocupado (ej: 13:00) NO esté visible
    cy.get("button")
        .filter(":visible")
        .contains("13:00")
        .should("not.exist");
});





});
