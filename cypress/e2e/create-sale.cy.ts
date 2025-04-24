describe("Formulario de Creación de Ventas - Flujo Completo", () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A"),
    };

    const DEPOSIT_SEARCH = "Deposito Reserva";
    const CUSTOMER_SEARCH = "Jose";
    const PRODUCT_SEARCH = "Correa de pecho";
    const INVOICE_NUMBER = "001-001-0000125";
    const TIMBRADO_NUMBER = "12345678";

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
        });

        cy.visit("/dashboard/new-sale");
    });

    it("Debe completar el flujo de venta correctamente", () => {
        // Interceptar las APIs
        cy.intercept("GET", "**/stock*").as("searchDeposits");
        cy.intercept("GET", "**/client*").as("searchClients");
        cy.intercept("GET", "**/product*").as("searchProducts");
        cy.intercept("GET", "**/payment-method*").as("getPaymentMethods");
        cy.intercept("POST", "**/invoice*").as("createInvoice");

        /* === PASO 1: Seleccionar depósito === */
        cy.get('input[placeholder*="depósito"]').type(DEPOSIT_SEARCH);

        // Esperar y verificar la respuesta de la API
        cy.wait("@searchDeposits").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });

        // Solución alternativa si .CommandItem no funciona
        cy.get('div[role="option"]').contains(DEPOSIT_SEARCH).click();

        // Verificar selección
        cy.contains(DEPOSIT_SEARCH).should("be.visible");

        /* === PASO 2: Completar datos de factura === */
        cy.get('input[placeholder*="123-123-1234567"]').type(INVOICE_NUMBER);
        cy.get('input[placeholder*="12345678"]').type(TIMBRADO_NUMBER);

        /* === PASO 3: Seleccionar cliente === */
        cy.get('input[placeholder="Buscar cliente..."]').type(CUSTOMER_SEARCH);
        cy.wait("@searchClients").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });
        cy.get('div[role="option"]').contains(CUSTOMER_SEARCH).click();

        /* === PASO 4: Buscar y agregar producto === */
        cy.get('[placeholder="Buscar por código o nombre del producto"]').type(PRODUCT_SEARCH);

        // Esperar la respuesta de la API
        cy.wait("@searchProducts").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.data).to.have.length.gt(0);
        });

        // Esperar que aparezca la opción en el dropdown y hacer clic
        cy.get('div[role="option"]')
            .contains(PRODUCT_SEARCH)
            .should("be.visible")
            .click();

        /* === PASO 5: Ajustar cantidad === */
        /* === PASO 6: Configurar método de pago === */
        cy.wait("@getPaymentMethods");


        cy.contains('label', 'Efectivo').click();
        // Ahora configuramos el monto a pagar
        cy.get("span:contains('Total:')").next().then(($total) => {
            const total = parseInt($total.text().replace(/[^\d]/g, ''));
            cy.get('input[id="payment-amount"]').type(total.toString());
            cy.contains("button", "Agregar").click();
        });

        /* === PASO 7: Finalizar venta === */
        cy.get("button").contains("Finalizar Venta").click();

        /* === PASO 8: Verificar éxito === */
        cy.wait("@createInvoice");
        cy.contains("Venta finalizada con éxito").should("be.visible");
        cy.url().should("include", "/dashboard/invoices");
        cy.get('button:has(svg.lucide-eye)').first().click();
        cy.url().should("match", /\/dashboard\/invoices\/\d+/);
    });
    it("Debe mostrar error si se usa un número de factura ya existente", () => {
        cy.get('input[placeholder*="depósito"]').type(DEPOSIT_SEARCH);
        cy.get('div[role="option"]').contains(DEPOSIT_SEARCH).click();

        cy.get('input[placeholder*="123-123-1234567"]').type(INVOICE_NUMBER); // Ya usado
        cy.get('input[placeholder*="12345678"]').type(TIMBRADO_NUMBER);

        cy.get('input[placeholder="Buscar cliente..."]').type(CUSTOMER_SEARCH);
        cy.get('div[role="option"]').contains(CUSTOMER_SEARCH).click();

        cy.get('[placeholder="Buscar por código o nombre del producto"]').type(PRODUCT_SEARCH);
        cy.get('div[role="option"]').contains(PRODUCT_SEARCH).click();

        cy.wait("@getPaymentMethods");
        cy.contains('label', 'Efectivo').click();

        cy.get("span:contains('Total:')").next().then(($total) => {
            const total = parseInt($total.text().replace(/[^\d]/g, ''));
            cy.get('input[id="payment-amount"]').type(total.toString());
            cy.contains("button", "Agregar").click();
        });

        cy.get("button").contains("Finalizar Venta").click();

        cy.wait("@createInvoice");
        cy.contains("ya está en uso").should("be.visible");
    });


    it("Debe mostrar errores si el formato de número de factura o timbrado es incorrecto", () => {
        cy.get('input[placeholder*="depósito"]').type(DEPOSIT_SEARCH);
        cy.get('div[role="option"]').contains(DEPOSIT_SEARCH).click();

        cy.get('input[placeholder*="123-123-1234567"]').type("001-1-000125");
        cy.get('input[placeholder*="12345678"]').type("12345"); // Timbrado con menos dígitos

        cy.contains("El número de timbrado debe tener 8 dígitos").should("be.visible");
        cy.contains("El número de factura debe tener el formato 123-123-1234567").should("be.visible");
    });

});
