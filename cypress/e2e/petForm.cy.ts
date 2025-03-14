describe('Registrar Mascota con PetForm', () => {
  const TIMEOUT = { timeout: 15000 };

  const waitOptions = { timeout: 30000 };

  it('Muestra la información del perfil y mascotas cuando el usuario está autenticado', () => {
    cy.intercept('GET', '**/user-profile*').as('getUserProfile');
    cy.intercept('GET', '**/pet*').as('getPets');
    
    cy.log('Iniciando sesión con un usuario válido');
    cy.visit('/login');  
    cy.get('input[name="email"]').type('makiko.yamamoto@fiuni.edu.py'); 
    cy.get('input[name="password"]').type('MakiYamaGin');  
    cy.get('button[type="submit"]').click();  
    
    cy.log('Esperando la respuesta de perfil y mascotas');
    cy.wait('@getUserProfile', waitOptions);
    cy.wait('@getPets', waitOptions);
    cy.wait(10000);
  
    cy.log('Verificando que la información del perfil y las mascotas se muestre correctamente');
    cy.get('h2.text-xl.font-bold.mt-2', waitOptions).should('contain.text', 'Makiko Yamamoto');  
    cy.contains('Tus Mascotas Registradas', waitOptions).should('be.visible');  
    cy.url(waitOptions).should('include', '/user-profile');  

    cy.log('Verificando la navegación hacia la página de agregar mascota');
    cy.contains('button', 'Agregar Mascota', waitOptions).click();
    cy.wait(5000);
    cy.url(waitOptions).should('include', '/pet/register'); 
    cy.go('back');  
    cy.wait(10000);
    
    cy.wait(5000); // Esperar la redirección
    cy.url().should('include', '/pet/register');
  });

  it("Registrar mascota con datos válidos e imagen", () => {
    cy.visit("/pet/register");
    cy.url().should("include", "/pet/register");

    const petData = {
      name: "Wanko",
      birthDate: "2022-01-01",
      weight: "12.5",
      gender: "Macho", 
    };

    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/species?page=1`).as(
      "getSpecies"
    );

    cy.intercept(
      "GET",
      `${Cypress.env("API_BASEURL")}/race?page=1&speciesId=1`
    ).as("getRaces");

    cy.intercept("POST", `${Cypress.env("API_BASEURL")}/pet`).as("registerPet");

    // Espera a que se carguen las especies
    cy.wait("@getSpecies", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);
    });

    // Completar el formulario
    cy.get("input[name='petName']", TIMEOUT).type(petData.name);
    cy.get("input[name='birthDate']").type(petData.birthDate);
    cy.get("input[name='weight']").type(petData.weight);

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

    // Redirección a perfil
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Mostrar errores de validación cuando no se llenan los campos", () => {
    cy.visit("/pet/register");
    cy.url().should("include", "/pet/register");

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
});

