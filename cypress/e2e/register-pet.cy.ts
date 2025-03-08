describe("Register Pet", () => {
  const TIMEOUT = {
    timeout: 15000,
  };

  beforeEach(() => {
    const sessionToken: string = Cypress.env("sessionToken");
    if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);
  });

  it("Debe iniciar sesión y obtener un token válido", () => {
    const userCredentials = {
      email: Cypress.env("USER_EMAIL") as string,
      password: Cypress.env("USER_PASSWORD") as string,
    };

    cy.intercept("POST", "/api/auth/callback/credentials").as("login");

    cy.visit("/login");
    cy.url().should("include", "/login");

    cy.get("input[name='email']").type(userCredentials.email, { log: false });
    cy.get("input[name='password']").type(userCredentials.password, {
      log: false,
    });
    cy.contains("Iniciar Sesión").click();

    cy.wait("@login", TIMEOUT).then((_) => {
      cy.getCookie("next-auth.session-token")
        .should("exist")
        .then((cookie) => {
          if (cookie) Cypress.env("sessionToken", cookie.value);
        });
    });

    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Navegar a /pet/register y enviar formulario con datos invalidos", () => {
    cy.visit("/pet/register");
    cy.url().should("include", "/pet/register");

    cy.contains("button", "Registrar Mascota").click();

    cy.contains("El nombre es obligatorio").should("be.visible");
    cy.contains("La fecha de nacimiento es obligatoria").should("be.visible");
    cy.contains("El peso debe ser un número válido mayor a 0").should(
      "be.visible"
    );
    cy.contains("Debes seleccionar un género").should("be.visible");
    cy.contains("Debes seleccionar un tipo de animal").should("be.visible");
    cy.contains("La raza es obligatoria").should("be.visible");

    cy.intercept("POST", `${Cypress.env("API_BASEURL")}/pet`).as("registerPet");
    cy.wait(2000);
    cy.get("@registerPet").should("not.exist");

    cy.contains("button", "Cancelar").click();
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it("Debe cargar datos validos y registrar una mascota", () => {
    cy.visit("/pet/register");
    cy.url().should("include", "/pet/register");

    const petData = {
      name: "TestName",
      birthDate: "2022-01-01",
      weight: "10.2",
    };

    cy.intercept(
      "GET",
      `${Cypress.env("API_BASEURL")}/race?page=1&speciesId=1`
    ).as("getRaces");

    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/species?page=1`).as(
      "getSpecies"
    );

    cy.intercept("POST", `${Cypress.env("API_BASEURL")}pet`).as("registerPet");

    cy.get("input[name='petName']", TIMEOUT).type(petData.name);
    cy.get("input[name='birthDate']").type(petData.birthDate);
    cy.get("input[name='weight']").type(petData.weight);

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
      if (interception.response)
        expect(interception.response.statusCode).to.eq(201);
      const requestBody = interception.request.body;
      expect(requestBody.name).to.eq(petData.name);
      expect(requestBody.weight).to.eq(parseFloat(petData.weight));
      expect(requestBody.sex).to.eq("F");
    });

    cy.wait(800);
    cy.contains("Mascota registrada con éxito!").should("exist");

    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });
});
