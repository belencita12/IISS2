describe("Register Pet", () => {
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

    cy.wait("@login", { timeout: 15000 }).then((_) => {
      cy.getCookie("next-auth.session-token")
        .should("exist")
        .then((cookie) => {
          if (cookie) Cypress.env("sessionToken", cookie.value);
        });
    });

    cy.location("pathname", { timeout: 10000 }).should("eq", "/dashboard");
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
  });

  it("Debe cargar datos validos y registrar una mascota", () => {
    cy.visit("/pet/register");
    cy.url().should("include", "/pet/register");

    const petData = {
      name: "TestName",
      birthDate: "2023-01-01",
      weight: "10.2",
    };

    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/race?page=1`).as(
      "getRaces"
    );

    cy.intercept("GET", `${Cypress.env("API_BASEURL")}/species?page=1`).as(
      "getSpecies"
    );

    cy.intercept("POST", `${Cypress.env("API_BASEURL")}pet`).as("registerPet");

    cy.get("input[name='petName']", { timeout: 10000 }).type(petData.name);
    cy.get("input[name='birthDate']").type(petData.birthDate);
    cy.get("input[name='weight']").type(petData.weight);

    cy.wait("@getRaces").then((int) => {
      const response = int.response;
      if (response) {
        cy.get('button[aria-controls="radix-:Rlpfnnl7:"]').click();
        cy.get('div[role="listbox"]')
          .contains("div", response.body.data[0].name)
          .click();
        cy.get('select[name="race"]').should(
          "have.value",
          response.body.data[0].id
        );
      }
    });

    cy.wait("@getSpecies").then((int) => {
      const response = int.response;
      if (response) {
        cy.get('button[aria-controls="radix-:Rm9fnnl7:"]').click();
        cy.get('div[role="listbox"]')
          .contains("div", response.body.data[0].name)
          .click();
        cy.get('select[name="race"]').should(
          "have.value",
          response.body.data[0].id
        );
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

    cy.contains("Mascota registrada con éxito!").should("be.visible");
  });
});
