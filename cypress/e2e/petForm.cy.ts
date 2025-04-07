const SESSION_KEY = "sessionToken";

describe('Registrar Mascota con PetForm', () => {

  const BASE_URL = Cypress.env("API_BASEURL");

  const PET_MOCK = {
    name: "Mia",
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
    cy.get('h2.text-xl.font-bold.mt-2', waitOptions).should('contain.text', 'Jose Valgaba');
    cy.contains('Tus Mascotas Registradas', waitOptions).should('be.visible');
    cy.url(waitOptions).should('include', '/user-profile');

  });

  it("Registrar mascota con datos válidos e imagen", () => {

    cy.intercept("GET", `${BASE_URL}/species?page=1`).as(
      "getSpecies"
    );
  
    cy.intercept(
      "GET",
      `${BASE_URL}/race?page=1&speciesId=*`
    ).as("getRaces");
  
    cy.intercept("POST", `${BASE_URL}/pet`).as("registerPet");

    cy.log('Verificando la navegación hacia la página de agregar mascota');
    cy.contains('button', 'Agregar Mascota').click();
    // Espera a que se carguen las especies
    cy.wait("@getSpecies", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);
    });
    cy.wait(5000);

    
  
    // Completar el formulario
    cy.get("input[name='petName']", TIMEOUT).type(PET_MOCK.name);
    cy.get("input[name='birthDate']").type(PET_MOCK.birthDate);
    cy.get("input[name='weight']").type(PET_MOCK.weight);


    // Seleccionar especie
    cy.get("button#animalType").click();
    cy.get('div[role="listbox"] div').first().click();
    
  
  
  
    cy.wait("@getRaces", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);
  
      // Seleccionar raza
      cy.get("button#breed").click();
      cy.get('div[role="listbox"] div').first().click();
    });
  
    // Seleccionar género
    cy.contains("button", "Macho").click();
  
    // Subir imagen de perfil
    const imagePath = "images/gato1.png"; // imagen desde la carpeta cypress/fixtures/images
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imagePath}`, {
      force: true,
    });
  
    // Enviar el formulario
    cy.contains("button", "Registrar Mascota").click();
  
    cy.wait("@registerPet").then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
  
      const requestBody = interception.request.body;
      // Verifica el requestBody si no es multipart/form-data
      // expect(requestBody.name).to.eq(petData.name);
    });
  
    // Verificar toast de éxito
    cy.contains("Mascota registrada con éxito!").should("exist");
  });

  it("Mostrar errores de validación cuando no se llenan los campos", () => {

    cy.log('Verificando la navegación hacia la página de agregar mascota');
    cy.contains('button', 'Agregar Mascota').click();
    cy.wait(5000);

    cy.contains("button", "Registrar Mascota").click();
  
    // Verificar que los errores de validación se muestran
    cy.contains("El nombre es obligatorio").should("be.visible");
    cy.contains("La fecha de nacimiento es obligatoria").should("be.visible");
    cy.contains("El peso debe ser un número válido mayor a 0").should(
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
    cy.intercept("GET", `${BASE_URL}/species?page=1`).as("getSpecies");
    cy.intercept("GET", `${BASE_URL}/race?page=1&speciesId=*`).as("getRaces");
    cy.intercept("POST", `${BASE_URL}/pet`).as("registerPet");
  
    cy.log('Navegar a la página de agregar mascota sin imagen');
    cy.contains('button', 'Agregar Mascota').click();
  
    cy.wait("@getSpecies", TIMEOUT);
    cy.wait(3000);
  
    cy.get("input[name='petName']").type(`${PET_MOCK.name} sin foto6`);
    cy.get("input[name='birthDate']").type(`2023-02-01`);
    cy.get("input[name='weight']").type(`14`);
  
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
  
    //Sin imagen 
  
    cy.contains("button", "Registrar Mascota").click();
  
    cy.wait("@registerPet").then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
    });
  
    cy.contains("Mascota registrada con éxito!").should("exist");
  });
  
  it("Registrar mascota con imagen de tamaño grande", () => {
    cy.intercept("GET", `${BASE_URL}/species?page=1`).as("getSpecies");
    cy.intercept("GET", `${BASE_URL}/race?page=1&speciesId=*`).as("getRaces");
    cy.intercept("POST", `${BASE_URL}/pet`).as("registerPet");
  
    cy.log('Navegar a la página de agregar mascota con imagen grande');
    cy.contains('button', 'Agregar Mascota').click();
  
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

    cy.contains("button", "Registrar Mascota").click();

    cy.contains("La imagen no debe superar 1MB").should("be.visible");

    cy.get("@registerPet").should("not.exist");
  
    // Regresar al perfil
    cy.contains("button", "Cancelar").click();
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Intentar registrar mascota con peso inválido", () => {
    cy.intercept("GET", `${BASE_URL}/species?page=1`).as("getSpecies");
    cy.intercept("GET", `${BASE_URL}/race?page=1&speciesId=*`).as("getRaces");
    cy.intercept("POST", `${BASE_URL}/pet`).as("registerPet");
  
    cy.log('Navegar a la página de agregar mascota con peso inválido');
    cy.contains('button', 'Agregar Mascota').click();
  
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
      .then((value)=>{
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