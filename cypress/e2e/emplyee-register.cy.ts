describe('Registro de Empleados', () => {
  
  let uniqueEmail = "";
  
  const SESSION_KEY = "sessionToken";
  const USER = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A")
  };

  const randomNumber = Math.floor(Math.random() * 100000);
  const randomPhoneNumber = `+595971${Math.floor(100000 + Math.random() * 900000)}`;
  const randomRuc = `${Math.floor(1000000 + Math.random() * 900000)}-1`;
  const randomAddress = `Calle${randomNumber}`;
  const TIMEOUT = { timeout: 15000 };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
      cy.wait(20000);
      cy.url().should('include', '/dashboard');
      cy.contains('p', "Empleados").click();
      cy.wait(2000);
    });
    // cy.visit('/dashboard/employee/register');
    // cy.wait('@getProducts');

  });

  it('Debe mostrar mensajes de error cuando se intenta enviar el formulario vacío', () => {
    cy.visit(`/dashboard/employee`);
    cy.intercept("GET", `/api/auth/session`).as("getAuthData");
    cy.get('button').contains('Agregar').click();

    cy.get('button').contains('Registrar').click();
    cy.contains('El RUC es obligatorio').should('be.visible');
    cy.contains('El nombre completo es obligatorio').should('be.visible');
    cy.contains('Correo electrónico inválido').should('be.visible');
    cy.contains('Debe seleccionar un puesto').should('be.visible');
    cy.wait(2000);
  });

  it('Debe registrar un empleado exitosamente con un email único', () => {

    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/work-position?page=1`).as(
      "getWorkPosition"
    );

    
    
    cy.visit(`/dashboard/employee`);
    cy.intercept("GET", `/api/auth/session`).as("getAuthData");
    cy.get('button').contains('Agregar').click();

    cy.wait("@getWorkPosition", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);
    });

    uniqueEmail = `test${randomNumber}@gmail.com`;
    cy.get('input[placeholder="Ingrese el RUC"]').type(randomRuc);
    cy.get('input[placeholder="Ingrese el nombre completo"]').type('Juan Pérez');
    cy.get('input[placeholder="Ingrese el correo"]').type(uniqueEmail);
    cy.get('input[placeholder="Ingrese la dirección"]').type(randomRuc);
    cy.get('input[placeholder="Ingrese el número de teléfono"]').type(randomPhoneNumber);
    cy.get('input[placeholder="Ingrese la dirección"]').type(randomAddress);
    
    // Abrimos el select de puesto
    cy.get('button[role="combobox"]').should('be.visible').click();

    // Seleccionamos el puesto (pon el nombre del puesto que te interese)
    cy.get('div[role="option"]').contains('Auxiliar').click();

    cy.contains('button', 'Registrar').click();
    cy.contains('Empleado registrado con éxito')
            .should('be.visible')
    cy.wait(5000);
  });

  it('Debe mostrar error al registrar un empleado con el mismo email', () => {
    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/work-position?page=*`).as(
      "getWorkPosition"
    );
    //  cy.get().type('Pérez');

    
    cy.visit(`/dashboard/employee`);
    cy.intercept("GET", `/api/auth/session`).as("getAuthData");
    cy.get('button').contains('Agregar').click();
    
    cy.wait("@getWorkPosition", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);
    });

    cy.get('input[placeholder="Ingrese el RUC"]').type(randomRuc);
    cy.get('input[placeholder="Ingrese el nombre completo"]').type('Juan Pérez');
    cy.get('input[placeholder="Ingrese el correo"]').type(uniqueEmail);
    cy.get('input[placeholder="Ingrese la dirección"]').type(randomRuc);
    cy.get('input[placeholder="Ingrese el número de teléfono"]').type(randomPhoneNumber);
    cy.get('input[placeholder="Ingrese la dirección"]').type(randomAddress);
    
    // Abrimos el select de puesto
    cy.get('button[role="combobox"]').should('be.visible').click();

    // Seleccionamos el puesto (con el nombre del puesto que te interese)
    cy.get('div[role="option"]').contains('Auxiliar').click();

    cy.contains('button', 'Registrar').click();
    cy.contains('Uno o más campos ya están en uso.').should('be.visible');
    cy.wait(5000);
  });
});
