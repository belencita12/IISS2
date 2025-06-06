const SESSION_KEY = "sessionToken";

describe('Registrar Mascota con PetForm', () => {

  const BASE_URL = Cypress.env("API_BASEURL");

  const PET_MOCK = {
    name: `Miau_${Date.now()}`,
    birthDate: "2023-01-01",
    weight: "123.5",
    gender: "Macho",
  };

  const TIMEOUT = { timeout: 15000 };
  const waitOptions = { timeout: 30000 };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    const sessionToken: string = Cypress.env(SESSION_KEY);
    if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);

    cy.intercept('GET', '**/user-profile*').as('getUserProfile');
    cy.intercept('GET', '**/pet*').as('getPets');

    cy.visit('/user-profile')
    cy.log('Esperando la respuesta de perfil y mascotas');
    cy.wait('@getUserProfile', waitOptions);
    cy.wait('@getPets', waitOptions);
    cy.wait(3000);
  });

  it('Muestra la información del perfil y mascotas cuando el usuario está autenticado', () => {

    cy.log('Verificando que la información del perfil y las mascotas se muestre correctamente');
    // Nueva sugerencia basada en el header actual
    cy.contains('Jose Valgaba', waitOptions).should('exist');
    cy.contains('Mascotas registradas', waitOptions).should('be.visible');
    cy.url(waitOptions).should('include', '/user-profile');

  });

  it("Registrar mascota con datos válidos e imagen", () => {

    cy.intercept("GET", `${BASE_URL}/species**`).as("getSpecies");
    cy.intercept("GET", `${BASE_URL}/race**`).as("getRaces");
    cy.intercept("POST", `${BASE_URL}/pet`).as("registerPet");

    cy.contains("Mis mascotas").click();
    cy.contains('button', 'Agregar').click();

    cy.wait("@getSpecies", TIMEOUT);

    cy.get('#petName').type(PET_MOCK.name);
    cy.get('#birthDate').type(PET_MOCK.birthDate);
    cy.get('#weight').type(PET_MOCK.weight);

    cy.get('#animalType').click();
    cy.get('[role="listbox"] div').first().click();

    cy.wait("@getRaces", TIMEOUT); // ahora sí debería interceptarse

    cy.get('#breed').click();
    cy.get('[role="listbox"] div').first().click();

    cy.get('#genderMale').click();

    const imagePath = "images/gato1.png";
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imagePath}`, {
      force: true,
    });

    cy.contains("Registrar").click();

    cy.wait("@registerPet").then((interception) => {
      // Mostrar status y contenido completo de la respuesta
      const status = interception.response?.statusCode;
      const responseBody = interception.response?.body;

      cy.log(`⚠️ Código de estado: ${status}`);
      cy.log(`📦 Respuesta del servidor: ${JSON.stringify(responseBody)}`);
      console.log("📤 Datos enviados:", interception.request?.body);
      console.log("📥 Respuesta del backend:", responseBody);

      // Forzar el fallo si no es 201, pero que deje ver el error
      expect(status, `Respuesta inesperada del servidor: ${JSON.stringify(responseBody)}`).to.eq(201);
    });



    cy.contains("Mascota registrada correctamente").should("exist");

  });

  it("Mostrar errores de validación cuando no se llenan los campos", () => {

    cy.log('Verificando la navegación hacia la página de agregar mascota');
    cy.contains("Mis mascotas").click();
    cy.contains('button', 'Agregar').click();
    cy.wait(5000);

    cy.contains("button", "Registrar").click();

    // Verificar que los errores de validación se muestran
    cy.contains("El nombre es obligatorio").should("be.visible");
    cy.contains("La fecha de nacimiento es obligatoria").should("be.visible");
    cy.contains("El peso debe ser un número mayor a 0").should(
      "be.visible"
    );
    cy.contains("Debes seleccionar un género").should("be.visible");
    cy.contains("Debes seleccionar un tipo de animal").should("be.visible");
    cy.contains("La raza es obligatoria").should("be.visible");

    // No se debe registrar la mascota si hay errores
    cy.intercept("POST", `${Cypress.env("API_BASEURL")}/pet`).as("registerPet");
    cy.wait(2000);
    cy.get("@registerPet").should("not.exist");

    // Regresar al perfil
    cy.contains("button", "Cancelar").click();
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Registrar mascota sin imagen", () => {
    cy.intercept("GET", `${BASE_URL}/species**`).as("getSpecies");
    cy.intercept("GET", `${BASE_URL}/race**`).as("getRaces");
    cy.intercept("POST", `${BASE_URL}/pet`).as("registerPet");

    cy.contains("Mis mascotas").click();
    cy.contains('button', 'Agregar').click();

    cy.wait("@getSpecies", TIMEOUT);

    cy.get("#petName").type(`${PET_MOCK.name} sin foto5`);
    cy.get("#birthDate").type(`2023-02-01`);
    cy.get("#weight").type(`14`);

    cy.get("#animalType").click();
    cy.get('[role="listbox"] div').first().click();

    cy.wait("@getRaces", TIMEOUT);
    cy.get("#breed").click();
    cy.get('[role="listbox"] div').first().click();

    cy.get("#genderMale").click();

    cy.contains("Registrar").click();

    cy.wait("@registerPet").then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
    });

    //cy.contains("Mascota registrada con éxito!").should("exist");
  });


  it("Registrar mascota con imagen de tamaño grande", () => {
    cy.intercept("GET", `${BASE_URL}/species?page=1`).as("getSpecies");
    cy.intercept("GET", "**/race**").as("getRaces");
    cy.intercept("POST", `${BASE_URL}/pet`).as("registerPet");

    cy.log('Navegar a la página de agregar mascota con imagen grande');
    cy.contains("Mis mascotas").click();
    cy.contains('button', 'Agregar').click();

    cy.wait("@getSpecies", TIMEOUT);
    cy.wait(3000);

    cy.get("input[name='petName']").type(`${PET_MOCK.name} Grande1`);
    cy.get("input[name='birthDate']").type("2022-05-05");
    cy.get("input[name='weight']").type("15");

    cy.get("button#animalType").click();
    cy.get('div[role="listbox"] div').first().click();

    cy.wait("@getRaces", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);

      // Seleccionar raza
      cy.get("button#breed").click();
      cy.get('div[role="listbox"] div').first().click();
    });

    cy.get("button#breed").click();
    cy.get('div[role="listbox"] div').first().click();

    cy.contains("button", "Hembra").click();

    const largeImagePath = "images/perroG.png";
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${largeImagePath}`, {
      force: true,
    });

    cy.wait(3000);

    cy.contains("button", "Registrar").click();

    cy.contains("La imagen no debe superar 1MB").should("be.visible");

    cy.get("@registerPet").should("not.exist");

    // Regresar al perfil
    cy.contains("button", "Cancelar").click();
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Intentar registrar mascota con peso inválido", () => {
    cy.intercept("GET", `${BASE_URL}/species?page=1`).as("getSpecies");
    cy.intercept("GET", "**/race**").as("getRaces");
    cy.intercept("POST", `${BASE_URL}/pet`).as("registerPet");

    cy.log('Navegar a la página de agregar mascota con peso inválido');
    cy.contains('button', 'Agregar').click();

    cy.wait("@getSpecies", TIMEOUT);
    cy.wait(3000);

    cy.get("input[name='petName']").type(`${PET_MOCK.name} PesoInválido2`);
    cy.get("input[name='birthDate']").type("2021-11-11");

    cy.get("button#animalType").click();
    cy.get('div[role="listbox"] div').first().click();

    cy.wait("@getRaces", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);

      // Seleccionar raza
      cy.get("button#breed").click();
      cy.get('div[role="listbox"] div').first().click();
    });

    cy.get("button#breed").click();
    cy.get('div[role="listbox"] div').first().click();

    cy.contains("button", "Macho").click();

    cy.get("input[name='weight']").type("-10"); // Peso negativo

    cy.get("input[name='weight']")
      .invoke('val')
      .then((value) => {
        const valorNumerico = Number(value)

        expect(valorNumerico).to.be.greaterThan(-1)
      })

    cy.get("@registerPet").should("not.exist");

    // Regresar al perfil
    cy.contains("button", "Cancelar").click();
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");

  });


});

//test inicial para ingresar sesion y guardar token
it("iniciar sesión", () => {
  const USER = {
    email: "jose@gmail.com",
    password: "12345678"
  };

  cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
});