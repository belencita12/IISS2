describe("Register Pet", () => {
  const TIMEOUT = { timeout: 15000 };
  const PET_ID_KEY = "PET_ID";
  const SESSION_KEY = "sessionToken";
  const PET_MOCK = {
    name: "MascotaTest",
    birthDate: "2022-01-02",
    weight: "10.2",
  };
  let testUser: BaseUser;

  before(() => {
    cy.intercept("POST", "**/auth/signup").as("register");
    cy.generateUser().then((user) => {
      testUser = user;
      cy.log("Registrando usuario de prueba...");
      cy.register(user);
      cy.wait("@register", { timeout: 16000 });
    });
  });

  beforeEach(() => {
    const sessionToken: string = Cypress.env(SESSION_KEY);
    if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);
  });

  it("Debe iniciar sesión y obtener un token válido", () => {
    expect(testUser).to.exist;
    cy.loginAndSetSession(SESSION_KEY, testUser.email, testUser.password);
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Detalle de mascota con id invalido", () => {
    const ERR_PET_ID = 9999;
    cy.visit("/detalle-mascota/" + ERR_PET_ID);
    cy.url().should("include", "/detalle-mascota/" + ERR_PET_ID);
    cy.intercept("GET", `**/pet/${ERR_PET_ID}`).as("registerPet");
    cy.wait(2000);
    cy.wait("@registerPet").then((int) => {
      const res = int.response;
      expect(res).to.exist;
      if (res) expect(res.statusCode).to.eq(404);
    });
    cy.contains("404").should("be.visible");
  });

  it("Debe cargar datos validos y registrar una mascota", () => {
    cy.visit("/pet/register");
    cy.url().should("include", "/pet/register");

    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/race?*`).as("getRaces");

    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/species?page=1`).as(
      "getSpecies"
    );

    cy.intercept("POST", `${Cypress.env("API_BASEURL")}pet`).as("registerPet");

    cy.get("input[name='petName']", TIMEOUT).type(PET_MOCK.name);
    cy.get("input[name='birthDate']").type(PET_MOCK.birthDate);
    cy.get("input[name='weight']").type(PET_MOCK.weight);

    cy.wait("@getSpecies", TIMEOUT).then((int) => {
      const response = int.response;
      if (response) {
        expect(response.statusCode).to.eq(200);
        cy.get("button[id=animalType]").click();
        cy.get('div[role="listbox"] div').first().click();
      }
    });

    cy.wait("@getRaces", TIMEOUT).then((int) => {
      const response = int.response;
      if (response) {
        expect(response.statusCode).to.eq(200);
        cy.get("button[id=breed]").click();
        cy.get('div[role="listbox"] div').first().click();
      }
    });

    cy.contains("button", "Hembra").click();

    cy.contains("button", "Registrar Mascota").click();

    cy.wait("@registerPet").then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(201);
        Cypress.env(PET_ID_KEY, interception.response.body.id);
      }
    });

    cy.wait(800);
    cy.contains("Mascota registrada con éxito!").should("exist");

    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Detalle de mascota con id valido", () => {
    cy.visit("/detalle-mascota/" + Cypress.env(PET_ID_KEY));
    cy.url().should("include", "/detalle-mascota/" + Cypress.env(PET_ID_KEY));
    cy.intercept(
      "GET",
      `${Cypress.env("API_BASEURL")}/pet/${Cypress.env(PET_ID_KEY)}`
    ).as("getPet");
    cy.wait(2000);
    cy.wait("@getPet", TIMEOUT).then((int) => {
      const res = int.response;
      expect(res).to.exist;
      if (res) expect(res.statusCode).to.eq(200);
    });
    cy.contains("p", PET_MOCK.name).should("be.visible");
    cy.contains("p", "F").should("be.visible");
    cy.contains("button", "Editar");
  });

  it("Editar nombre de mascota con id valido", () => {
    cy.visit("/detalle-mascota/" + Cypress.env(PET_ID_KEY));
    cy.url().should("include", "/detalle-mascota/" + Cypress.env(PET_ID_KEY));
    cy.intercept(
      "GET",
      `${Cypress.env("API_BASEURL")}/pet/${Cypress.env(PET_ID_KEY)}`
    ).as("getPet");
    cy.wait(2000);
    cy.wait("@getPet", TIMEOUT).then((int) => {
      const res = int.response;
      expect(res).to.exist;
      if (res) expect(res.statusCode).to.eq(200);
    });
    cy.contains("p", PET_MOCK.name).should("be.visible");
    cy.contains("p", "F").should("be.visible");
    cy.contains("button", "Editar").click();

    cy.get("input[name='name']").clear();
    cy.contains("button", "Guardar").click();
    cy.contains("p", "El nombre no puede estar vacío.", TIMEOUT).should(
      "be.visible"
    );

    cy.get("input[name='name']", TIMEOUT).type("EditedName");
    cy.contains("button", "Guardar").click();

    cy.contains("p", "EditedName", TIMEOUT).should("be.visible");
  });
});
