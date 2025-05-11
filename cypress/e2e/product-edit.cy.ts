describe("Edición de Producto", () => {
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
        cy.visit('/dashboard/products');
        cy.url().should('include', '/dashboard/products');
    });

    it("Debe permitir la edición de un producto exitosamente con imagen válida", () => {
        const random = Math.floor(Math.random() * 100000);

        cy.contains("Producto 38393")
        .closest("div.flex")
        .within(() => {
            cy.contains("Ver detalles").click();
        });

        cy.contains("button", "Editar").click();

        cy.url().should("include", "/dashboard/products/update");
        cy.get('input[placeholder="Ingrese el nombre del producto"]').clear().type(`Producto Editado ${random}`);
        cy.get("textarea").clear().type("Descripción modificada de prueba");

        cy.get("#cost").clear().type("12000");
        cy.get("#price").clear().type("16000");
        cy.get("#iva").clear().type("12");

        // Seleccionar proveedor (segundo elemento en la lista)
        cy.contains("label", "Proveedor")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").eq(1).click();
        // Seleccionar etiqueta (segunda opción)
        cy.contains("label", "Etiqueta/s")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").eq(0).click();
        cy.get('input[type="file"]').selectFile("cypress/fixtures/images/Producto-Valido.png", {
            force: true,
        });

        // Enviar formulario
        cy.contains("button", "Guardar").click();

        // Confirmación de éxito
        cy.contains("Producto actualizado con éxito", { timeout: 15000 }).should("be.visible");
    });

    it("Debe mostrar errores al intentar enviar el formulario vacío", () => {
        // Selecciona un producto para editar
        cy.contains("Producto 38393")
        .closest("div.flex")
        .within(() => {
            cy.contains("Ver detalles").click();
        });

        cy.contains("button", "Editar").click();

        cy.url().should("include", "/dashboard/products/update");

        cy.get('input[placeholder="Ingrese el nombre del producto"]').clear();
        cy.get("textarea").clear();
        cy.get("#cost").clear();
        cy.get("#price").clear();
        cy.get("#iva").clear();

        cy.contains("button", "Guardar").click();

        cy.contains("El nombre es obligatorio").should("be.visible");
        cy.contains("Complete con valores numéricos adecuados").should("be.visible");
        cy.contains("Selecciona al menos una etiqueta").should("be.visible");
    });

    it("Debe rechazar imagen no válida al intentar subir una imagen no permitida", () => {
        cy.contains("Producto 38393")
        .closest("div.flex")
        .within(() => {
            cy.contains("Ver detalles").click();
        });

        cy.contains("button", "Editar").click();

        cy.url().should("include", "/dashboard/products/update");
        // Subir una imagen no válida
        cy.get('input[type="file"]').selectFile("cypress/fixtures/images/ProductoG.jpg", {
            force: true,
        });
        cy.contains("button", "Guardar").click();
        // Verificar que se muestra el mensaje de error para imagen no válida
        cy.contains("La imagen no debe superar 1MB").should("be.visible");
    });

    it("Debe permitir editar un producto sin descripción", () => {
        const random = Math.floor(Math.random() * 100000);

        cy.contains("Producto 38393")
        .closest("div.flex")
        .within(() => {
            cy.contains("Ver detalles").click();
        });

        cy.contains("button", "Editar").click();

        cy.url().should("include", "/dashboard/products/update");

        cy.get('input[placeholder="Ingrese el nombre del producto"]').clear().type(`Producto Editado ${random}`);
        cy.get("textarea").clear();

        cy.get("#cost").clear().type("12000");
        cy.get("#price").clear().type("16000");
        cy.get("#iva").clear().type("12");

        // Selección de proveedor (segundo elemento)
        cy.contains("label", "Proveedor")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").eq(1).click();

        // Selección de etiqueta (segunda opción)
        cy.contains("label", "Etiqueta/s")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").eq(0).click();

        // Enviar formulario
        cy.contains("button", "Guardar").click();

        // Confirmación de éxito
        cy.contains("Producto actualizado con éxito", { timeout: 15000 }).should("be.visible");
    });

    it("Debe mostrar error si no se selecciona un proveedor al editar", () => {
        const random = Math.floor(Math.random() * 100000);

        cy.contains("Producto 38393")
        .closest("div.flex")
        .within(() => {
            cy.contains("Ver detalles").click();
        });

        cy.contains("button", "Editar").click();

        cy.url().should("include", "/dashboard/products/update");

        // Editar sin seleccionar proveedor
        cy.get('input[placeholder="Ingrese el nombre del producto"]').clear().type(`Producto Editado ${random}`);
        cy.get("textarea").clear().type("Producto sin proveedor");
        cy.get("#cost").clear().type("12000");
        cy.get("#price").clear().type("16000");
        cy.get("#iva").clear().type("12");

        // Selección de etiqueta (segunda opción)
        cy.contains("label", "Etiqueta/s")
            .parent()
            .within(() => {
                cy.get("[role=combobox]").click();
            });
        cy.get("[role=option]").eq(0).click();

        cy.contains("button", "Guardar").click();

        // Verifica mensaje de error del proveedor
        cy.contains("Selecciona un proveedor").should("be.visible");
    });
});
