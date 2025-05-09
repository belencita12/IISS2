describe("Registro de Producto", () => {
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
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard/products/register');
        cy.url().should('include', '/dashboard/products/register');
    });

    it("Debe registrar un producto exitosamente con imagen válida", () => {
        const random = Math.floor(Math.random() * 100000);

        cy.get('input[placeholder="Ingrese el nombre del producto"]').type(
            `Producto ${random}`
        );
        cy.get("textarea").type("Descripción de prueba");
        cy.get("#cost").type("10000");
        cy.get("#price").type("15000");
        cy.get("#iva").type("10");

        // Seleccionar proveedor
        cy.contains("label", "Proveedor")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").first().click();

        // Seleccionar etiquetas
        cy.contains("label", "Etiqueta/s")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").first().click();

        // Subir imagen válida
        cy.get('input[type="file"]').selectFile("cypress/fixtures/images/Producto-Valido.png", {
            force: true,
        });

        // Enviar formulario
        cy.contains("button", "Guardar").click();

        // Confirmación de éxito
        cy.contains("Producto registrado con éxito", { timeout: 20000 }).should("be.visible");
    });

    it("Debe mostrar errores al intentar enviar vacío", () => {
        cy.contains("button", "Guardar").click();

        cy.contains("El nombre es obligatorio").should("be.visible");
        cy.contains("Complete con valores numéricos adecuados").should("be.visible");
        cy.contains("Selecciona al menos una etiqueta").should("be.visible");
    });

    it("Debe rechazar imagen no válida", () => {
        cy.get('input[type="file"]').selectFile("cypress/fixtures/images/ProductoG.jpg", {
            force: true,
        });
        cy.contains("button", "Guardar").click();
        cy.contains("La imagen no debe superar 1MB").should("be.visible");
    });

    it("Debe registrar un producto sin descripción", () => {
        const random = Math.floor(Math.random() * 100000);

        cy.get('input[placeholder="Ingrese el nombre del producto"]').type(
            `Producto ${random}`
        );

        // No se llena la descripción

        cy.get("#cost").type("10000");
        cy.get("#price").type("15000");
        cy.get("#iva").type("10");

        cy.contains("label", "Proveedor")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").eq(1).click();

        cy.contains("label", "Etiqueta/s")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").eq(1).click();
        cy.contains("button", "Guardar").click();
        cy.contains("Producto registrado con éxito", { timeout: 10000 }).should(
            "be.visible"
        );
    });

    it("Debe mostrar error si no se selecciona un proveedor", () => {
        const random = Math.floor(Math.random() * 100000);

        cy.get('input[placeholder="Ingrese el nombre del producto"]').type(
            `Producto ${random}`
        );
        cy.get("textarea").type("Producto sin proveedor");
        cy.get("#cost").type("10000");
        cy.get("#price").type("15000");
        cy.get("#iva").type("10");

        // Selección de etiqueta
        cy.contains("label", "Etiqueta/s")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").eq(1).click();

        cy.contains("button", "Guardar").click();

        // Verifica mensaje de error del proveedor
        cy.contains("Selecciona un proveedor").should("be.visible");
    });
});

