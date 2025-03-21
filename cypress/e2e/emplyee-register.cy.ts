describe('Registro de Empleados', () => {
    let uniqueEmail = "";
    let uniqueRUC = "";
    const SESSION_KEY = "sessionToken";
    const USER = {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD")
    };

    beforeEach(() => {
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(20000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard/employee/register');
        cy.url().should('include', '/dashboard/employee/register');
        cy.wait(2000);
    });

    it('Debe mostrar mensajes de error cuando se intenta enviar el formulario vacío', () => {
        cy.get('button').contains('Registrar').click();
        cy.contains('El RUC es obligatorio').should('be.visible');
        cy.contains('El nombre completo es obligatorio').should('be.visible');
        cy.contains('Correo electrónico inválido').should('be.visible');
        cy.contains('Debe seleccionar un puesto').should('be.visible');
    });

    it('Debe registrar un empleado exitosamente con un email único', () => {
        const randomNumber = Math.floor(Math.random() * 100000);
        uniqueEmail = `testuser${randomNumber}@gmail.com`;
        uniqueRUC = `${randomNumber}-1`;
        
        cy.get('input[placeholder="Ingrese el RUC"]').type(uniqueRUC);
        cy.get('input[placeholder="Ingrese el nombre completo"]').type('Pérez');
        cy.get('input[placeholder="Ingrese el correo"]').type(uniqueEmail);
        cy.contains('Seleccione un puesto').click(); 
        cy.wait(500);
        cy.get('select').invoke('show').select('Auxiliar', { force: true });  
        cy.get('button').contains('Registrar').click();
        cy.get('section[aria-label="Notifications alt+T"]')
            .should('be.visible')
            .and('contain', 'Empleado registrado con éxito');
    });

    it('Debe mostrar error al registrar un empleado con el mismo email', () => {
        cy.get('input[placeholder="Ingrese el RUC"]').type(uniqueRUC);
        cy.get('input[placeholder="Ingrese el nombre completo"]').type('Pérez');
        cy.get('input[placeholder="Ingrese el correo"]').type(uniqueEmail);
        cy.contains('Seleccione un puesto').click(); 
        cy.wait(500);
        cy.get('select').invoke('show').select('Auxiliar', { force: true }); 
        cy.get('button').contains('Registrar').click();
        cy.get('section[aria-label="Notifications alt+T"]')
            .should('be.visible')
            .and('contain', 'Hubo un error desconocido');
    });
});
