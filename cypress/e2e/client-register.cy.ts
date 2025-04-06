import { phoneNumber } from "@/lib/schemas";

describe('Registro de Cliente', () => {
    let uniqueEmail = "";
    let uniqueAdress = "";
    let uniquePhone = "";
    let uniqueRuc = "";
    const SESSION_KEY = "sessionToken";
    const USER = {
        email:  Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD")
    
    };

    const random = () => Math.random().toString(36).substring(2, 8);
    const randomAdress = `Avda${random()}`;
    const randomPhoneNumber = `+595971${Math.floor(100000 + Math.random() * 900000)}`;
    const randomRuc = `${Math.floor(1000000 + Math.random() * 900000)}-1`;

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
        uniqueAdress = `Avda${randomAdress}`;
        uniquePhone = `0981${randomNumber}`;
        uniqueRuc = `${randomNumber}-1`;

        cy.get('input[placeholder="Ingrese el nombre del cliente"]').type('Juan');
        cy.get('input[placeholder="Ingrese el apellido del cliente"]').type('Pérez');
        cy.get('input[placeholder="ejemplo@gmail.com"]').type(uniqueEmail);
        cy.get('input[placeholder="Ingrese la dirrección del cliente"]').type(uniqueAdress);
        cy.get('input[placeholder="Ingrese el número de teléfono"]').clear().type(uniquePhone);
        cy.get('input[placeholder="Ingrese el RUC"]').clear().type(uniqueRuc);
        cy.get('button').contains('Agregar cliente').click();
        cy.wait(2000);
        cy.get('section[aria-label="Notifications alt+T"]')
            .should('be.visible') 
            .and('contain', 'Registro exitoso!');
    });

    it('Debe mostrar error al registrar un usuario con el mismo email', () => {
        cy.get('input[placeholder="Ingrese el nombre del cliente"]').type('Juan');
        cy.get('input[placeholder="Ingrese el apellido del cliente"]').type('Pérez');
        cy.get('input[placeholder="ejemplo@gmail.com"]').type(uniqueEmail);
        cy.get('input[placeholder="Ingrese la dirrección del cliente"]').type(uniqueAdress);
        cy.get('input[placeholder="Ingrese el numero de telefono"]').clear().type(uniquePhone);
        cy.get('input[placeholder="Ingrese el ruc"]').clear().type(uniqueRuc);
        cy.get('button').contains('Agregar cliente').click();
        cy.wait(2000);
        cy.get('section[aria-label="Notifications alt+T"]')
            .should('be.visible') 
            .and('contain', 'Correo ya registrado');
    });


    it('Evitar que se envie el formulario con campos vacios', () => {
        cy.get('button').contains('Agregar cliente').click();
        cy.get('input[name="name"]').should('have.attr', 'required'); 
        cy.get('input[name="name"]').should('be.empty'); 
        cy.get('input[name="name"]').should('have.prop', 'validity').its('valueMissing').should('be.true');
    });

    it('Debe mostrar un mensaje de error si el email no es válido', () => {
        cy.get('input[name="email"]').type('asdasd');
        cy.get('input[name="email"]').blur();
        cy.get('input[name="email"]').should('have.prop', 'validity').its('typeMismatch').should('be.true');
        cy.contains('Introduce un email válido').should('be.visible');
        cy.contains("button", "Cancelar").click();
    });
});
