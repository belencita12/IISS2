import { phoneNumber } from "@/lib/schemas";

describe('Registro de Cliente', () => {
    let uniqueEmail = "";
    const SESSION_KEY = "sessionToken";
    const USER = {
        email:  Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD")
    
    };
    

    beforeEach(() => {
     
      cy.clearCookies();
      cy.clearLocalStorage();
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
            cy.wait(5000);
            cy.url().should('include', '/dashboard');
        });
        cy.visit('/dashboard/clients/register');
        cy.url().should('include', '/dashboard/clients/register');
    });

    it('Debe registrar un cliente exitosamente con un email único', () => {
        const randomNumber = Math.floor(Math.random() * 100000);
        uniqueEmail = `testuser${randomNumber}@gmail.com`;
        const randomAddress = `Avda${randomNumber}`;
        const randomPhoneNumber = `+595971${Math.floor(100000 + Math.random() * 900000)}`;
        const randomRuc = `${Math.floor(1000000 + Math.random() * 900000)}-1`;
    
        cy.get('input[placeholder="Ingrese el nombre del cliente"]').type('Juan');
        cy.get('input[placeholder="Ingrese el apellido del cliente"]').type('Pérez');
        cy.get('input[placeholder="ejemplo@gmail.com"]').type(uniqueEmail);
        cy.get('input[placeholder="Ingrese la dirección del cliente"]').type(randomAddress);
        cy.get('input[placeholder="Ingrese el número de teléfono"]').type(randomPhoneNumber);
        cy.get('input[placeholder="Ingrese el RUC del cliente"]').type(randomRuc);
        cy.get('button').contains('Agregar cliente').click();
        cy.wait(2000);
        cy.contains('Cliente registrado con éxito').should('be.visible');
        cy.visit('/dashboard/clients');
        cy.wait(5000);
    });

    // it('Debe mostrar error al registrar un usuario con el mismo email', () => {
    //     const randomNumber = Math.floor(Math.random() * 100000);
    //     uniqueEmail = `testuser${randomNumber}@gmail.com`;
    //     const randomAddress = `Avda${randomNumber}`;
    //     const randomPhoneNumber = `+595971${Math.floor(100000 + Math.random() * 900000)}`;
    //     const randomRuc = `${Math.floor(1000000 + Math.random() * 900000)}-1`;
    
    //     cy.get('input[placeholder="Ingrese el nombre del cliente"]').type('Juan');
    //     cy.get('input[placeholder="Ingrese el apellido del cliente"]').type('Pérez');
    //     cy.get('input[placeholder="ejemplo@gmail.com"]').type(uniqueEmail);
    //     cy.get('input[placeholder="Ingrese la dirección del cliente"]').type(randomAddress);
    //     cy.get('input[placeholder="Ingrese el número de teléfono"]').type(randomPhoneNumber);
    //     cy.get('input[placeholder="Ingrese el RUC del cliente"]').type(randomRuc);
    //     cy.get('button').contains('Agregar cliente').click();
    //     cy.wait(2000);
    //     cy.get('section[aria-label="Notifications alt+T"]')
    //         .should('be.visible') 
    //         .and('contain', 'Correo ya registrado');
    // });


    it('Evitar que se envie el formulario con campos vacios', () => {
        cy.get('button').contains('Agregar cliente').click();
        cy.contains('El nombre es obligatorio').should('be.visible');
        cy.wait(5000);
    });

    it('Debe mostrar un mensaje de error si el email no es válido', () => {
        cy.get('input[name="email"]').type('asdasd');
        cy.get('input[name="email"]').blur();
        cy.get('input[name="email"]').should('have.prop', 'validity').its('typeMismatch').should('be.true');
        cy.get('button').contains('Agregar cliente').click();
        cy.contains('El formato del correo electrónico no es válido').should('be.visible');
        cy.contains("button", "Cancelar").click();
        cy.wait(5000);
    });
});
