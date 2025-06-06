describe("Register Pet", () => {
  const TIMEOUT = { timeout: 15000 };

  const SESSION_KEY = "clientSession";
  const USER = {
    email: Cypress.env("USER_EMAIL"),
    password: Cypress.env("USER_PASSWORD"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/user-profile");
  });

  it("Debe iniciar sesión y redirigir al perfil de usuario", () => {
    cy.wait(3000);
    cy.visit("/user-profile");
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Detalle de mascota con id inválido", () => {
    const ERR_PET_ID = 9999;
    //cy.intercept("GET", `**/pet/${ERR_PET_ID}`).as("getInvalidPet");
    cy.visit(`/user-profile/pet/${ERR_PET_ID}`);
    cy.url().should("include", `/user-profile/pet/${ERR_PET_ID}`);
    //cy.wait("@getInvalidPet").then((int) => {
    //expect(int.response?.statusCode).to.eq(404);
    //});
    cy.wait(8000);
    cy.contains("No se encontraron datos").should("be.visible");
  });

  it("Debe cargar datos válidos y registrar una mascota", () => {
    const uniqueSuffix = Date.now();
    const petName = `MascotaTest_${uniqueSuffix}`;
    const birthDate = "2022-01-02";
    const weight = "10.2";

    cy.visit("/user-profile/pet/register");

    cy.intercept("GET", "**/race?*").as("getRaces");
    cy.intercept("GET", "**/species?page=1").as("getSpecies");
    cy.intercept("POST", "**/pet").as("registerPet");

    cy.get("input[name='petName']", TIMEOUT).type(petName);
    cy.get("input[name='birthDate']").type(birthDate);
    cy.get("input[name='weight']").type(weight);

    cy.wait("@getSpecies").then((int) => {
      expect(int.response?.statusCode).to.eq(200);
      cy.get("button#animalType").click();
      cy.get('div[role="listbox"] div').first().click();
    });

    cy.wait("@getRaces").then((int) => {
      expect(int.response?.statusCode).to.eq(200);
      cy.get("button#breed").click();
      cy.get('div[role="listbox"] div').first().click();
    });

    cy.contains("button", "Hembra").click();
    cy.contains("button", "Registrar").click();

    cy.wait("@registerPet").then((interception) => {
      const response = interception.response;
      expect(response, "No hay respuesta del backend").to.exist;
      expect(response?.statusCode).to.eq(201);
    });

    cy.contains("Mascota registrada correctamente").should("exist");
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });


  it("Detalle de mascota con ID válido", () => {
    const petId = 27;
    cy.intercept("GET", `**/pet/${petId}`).as("getPet");
    cy.visit(`/user-profile/pet/${petId}`);
    cy.wait("@getPet").then((int) => {
      expect(int.response?.statusCode).to.eq(200);
    });

    cy.contains("button", "Editar");
  });

  it("Editar nombre de mascota con ID válido", () => {
    const petId = 27;
    cy.intercept("GET", `**/pet/${petId}`).as("getPetForEdit");
    cy.visit(`/user-profile/pet/${petId}`);
    cy.wait("@getPetForEdit");

    cy.contains("button", "Editar").click();

    // Usa input visible (o primero)
    cy.get("input").filter(":visible").first().clear();
    cy.contains("button", "Editar").click();
    cy.contains("El campo no puede ser vacío").should("be.visible");

    cy.get("input").filter(":visible").first().type("RUFO");
    cy.contains("button", "Editar").click();
    cy.contains("RUFO").should("be.visible");
  });

});
