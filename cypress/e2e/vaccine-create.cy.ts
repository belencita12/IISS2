describe('Crear Vacunas', () => {
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A")
    };
    let uniqueName = "";

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(10000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard');
        cy.contains('p', "Vacunas").click();
        cy.url().should('include', '/dashboard/vaccine');
    });

    it('Los botones para interactuar con el formulario deben ser visibles', () => {
        cy.visit('/dashboard/vaccine');
        cy.wait(5000);
        cy.get('button').contains('Agregar nueva vacuna').should('be.visible');
        cy.get('button').contains('Fabricantes de Vacuna').should('be.visible');
    });

    it('Debe mostrar mensajes de error cuando se intenta enviar el formulario vacío', () => {
        cy.visit('/dashboard/vaccine/new');
        cy.wait(2000);
        cy.get('button').contains('Agregar Vacuna').click();
        cy.wait(2000);
        cy.contains('El nombre es obligatorio').should('be.visible');
        cy.contains('Complete con valores numéricos adecuados').should('be.visible');
        cy.wait(8000);
    });

    it('Debe permitir ingresar los datos correctamente y crear la vacuna', () => {
        cy.visit('/dashboard/vaccine/new');
        const randomNumber = Math.floor(Math.random() * 100000);
        uniqueName = `VacunaTest${randomNumber}`;

        cy.get('input[placeholder="Ingrese un nombre"]').type(uniqueName);
        cy.get('input[placeholder="Ingrese el costo"]').type('1000');
        cy.get('input[placeholder="Ingrese el IVA"]').type('10');
        cy.get('input[placeholder="Ingrese el precio"]').type('1500');
        cy.get('input[placeholder="Buscar especie..."]').type("Perro");
        cy.get('div[class="p-2 hover:bg-gray-100 cursor-pointer"]:contains("Perro")').click();
        cy.get('input[placeholder="Buscar fabricante..."]').type("FabricanteTest11677");
        cy.get('div[class="p-2 hover:bg-gray-100 cursor-pointer"]:contains("FabricanteTest11677")').click();
        
        cy.get('button').contains('Agregar Vacuna').click();
        cy.contains('Vacuna creada exitosamente')
            .should('be.visible')
        cy.wait(5000);
        cy.url().should('include', '/dashboard/vaccine');
    });

    // it('Intentar crear una vacuna con un nombre repetido', () => {
    //     const repeatedName = 'VacunaTest20614';

    //     cy.visit('/dashboard/vaccine/new');
    //     cy.get('input[placeholder="Ingrese un nombre"]').type(repeatedName);
    //     cy.get('input[placeholder="Ingrese el costo"]').type('1000');
    //     cy.get('input[placeholder="Ingrese el IVA"]').type('10');
    //     cy.get('input[placeholder="Ingrese el precio"]').type('1500');
    //     cy.get('input[placeholder="Buscar especie..."]').type("Perro");
    //     cy.get('div[class="p-2 hover:bg-gray-100 cursor-pointer"]:contains("Perro")').click();
    //     cy.get('input[placeholder="Buscar fabricante..."]').type("FabricanteTest11677");
    //     cy.get('div[class="p-2 hover:bg-gray-100 cursor-pointer"]:contains("FabricanteTest11677")').click();
        
    //     cy.get('button').contains('Agregar Vacuna').click();
    //     cy.get('section[aria-label="Notifications alt+T"]')
    //         .should('be.visible')
    //     cy.wait(5000);
        
    // });

    it('Presionar botón cancelar debe redirigir al listado de vacunas', () => {
        cy.visit('/dashboard/vaccine/new');
        cy.get('button').contains('Cancelar').click();
        cy.wait(5000);
        cy.url().should('include', '/dashboard/vaccine');
    });
});
