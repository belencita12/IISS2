describe('Crear Vacunas', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A")
    };
    const uniqueName = "";

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(20000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard');
        cy.contains('p', "Vacunas").click();

    });

    it('Los botones para interactuar con el formulario deben ser visibles', () => {
        cy.get('button').contains('Agregar').should('be.visible');
        cy.get('button').contains('Fabricantes de vacunas').should('be.visible');
    });

    it('Debe mostrar mensajes de error cuando se intenta enviar el formulario vacío', () => {
        cy.get('button').contains('Agregar').click();
        cy.wait(8000);
        cy.get('button').contains('Agregar').click();
        cy.contains('El nombre es obligatorio').should('be.visible');
        cy.contains('Required').should('be.visible');
        cy.wait(20000);
    });

    it('Debe permitir ingresar los datos correctamente y crear la vacuna', () => {
        cy.get('button').contains('Agregar').click();
        cy.wait(8000);

        const randomNumber = Math.floor(Math.random() * 100000);
        const uniqueName = `VacunaTest${randomNumber}`;

        // ✅ Usamos el label para evitar múltiples matches
        cy.contains("label", "Nombre")
            .parent()
            .find('input[placeholder="Ingrese el nombre"]')
            .type(uniqueName);

        cy.get('input[placeholder="Ingrese el costo"]').type('1000');
        cy.get('input[placeholder="Ingrese el IVA"]').type('10');
        cy.get('input[placeholder="Ingrese el precio"]').type('1100');

        /*cy.contains("label", "Especie")
            .parent()
            .find('input[placeholder="Buscar por nombre..."]')
            .type("Perro");

        // ✅ Espera hasta que aparezca la opción "Canino"
        cy.contains("div", "Perro", { timeout: 10000 }).click();


        // Seleccionar fabricante
        cy.contains("label", "Fabricante")
            .parent()
            .find('input[placeholder="Buscar por nombre..."]')
            .type("FabricanteTest2710");
        cy.get('div.p-2.hover\\:bg-gray-100.cursor-pointer').contains("FabricanteTest2710").click();

        cy.get('button').contains('Agregar Vacuna').click();
        cy.contains('Vacuna creada exitosamente').should('be.visible');
        cy.url().should('include', '/dashboard/vaccine');*/
    });


    it('Intentar crear una vacuna con un nombre repetido', () => {
        cy.get('button').contains('Agregar').click();
        cy.wait(8000);

        /*
        cy.contains("label", "Nombre")
            .parent()
            .find('input[placeholder="Ingrese el nombre"]')
            .type(uniqueName);

        cy.get('input[placeholder="Ingrese el costo"]').type('1000');
        cy.get('input[placeholder="Ingrese el IVA"]').type('10');
        cy.get('input[placeholder="Ingrese el precio"]').type('1100');*/

       /* cy.contains("label", "Especie")
            .parent()
            .find('input[placeholder="Buscar por nombre..."]')
            .type("Perro");

        // ✅ Espera hasta que aparezca la opción "Canino"
        cy.contains("div", "Perro", { timeout: 10000 }).click();


        // Seleccionar fabricante
        cy.contains("label", "Fabricante")
            .parent()
            .find('input[placeholder="Buscar por nombre..."]')
            .type("FabricanteTest2710");
        cy.get('div.p-2.hover\\:bg-gray-100.cursor-pointer').contains("FabricanteTest2710").click();

        cy.get('button').contains('Agregar').click();

        // Validar notificación de error
        cy.get('section[aria-label="Notifications alt+T"]')
            .should('be.visible')
            .and('contain', 'ya existe');*/

        cy.wait(3000);
    });


    it('Presionar botón cancelar debe redirigir al listado de vacunas', () => {
        cy.get('button').contains('Agregar').click();
        cy.wait(8000);
        cy.get('button').contains('Cancelar').click();
        cy.wait(5000);
        cy.url().should('include', '/dashboard/vaccine');
    });
});
