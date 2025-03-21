import { PetData } from "@/lib/pets/IPet";

describe("Listado de Mascotas", () => {
  const TIMEOUT = { timeout: 30000 };
  const SESSION_TOKEN = "sessionToken";

  type PetDataMock = Pick<PetData, "name" | "dateOfBirth" | "weight">;

  const petData: PetDataMock = {
    name: "Kira",
    dateOfBirth: "2022-01-01",
    weight: 10.2,
  };

  let testUser: BaseUser;

  const registrarPet = (pet: PetDataMock) => {
    cy.wait("@getSpecies", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);
      cy.get("button#animalType").click();
      cy.get('div[role="listbox"] div').first().click();
    });

    cy.wait(5000);

    cy.get("input[name='petName']", TIMEOUT).type(pet.name);
    cy.get("input[name='birthDate']").type(pet.dateOfBirth);
    cy.get("input[name='weight']").type(pet.weight.toString());

    cy.wait("@getRaces", TIMEOUT).then((int) => {
      const response = int.response;
      expect(response?.statusCode).to.eq(200);
      cy.get("#breed").click();
      cy.get('[role="option"]').first().click();
    });
    cy.contains("button", "Macho").click();
    cy.contains("button", "Registrar Mascota").click();
    cy.contains("Mascota registrada con éxito!").should("exist");
  };

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept("POST", "**/auth/signup").as("register");
    cy.generateUser().then((user) => {
      testUser = user;
      cy.log("Registrando usuario de prueba...");
      cy.register(user);
      cy.wait("@register", { timeout: 16000 });
    });
  });

  beforeEach(() => {
    const sessionToken: string = Cypress.env("sessionToken");
    if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);
  });

  it("Debe iniciar sesión y obtener un token válido", () => {
    expect(testUser).to.exist;
    cy.loginAndSetSession(SESSION_TOKEN, testUser.email, testUser.password);
    cy.location("pathname", TIMEOUT).should("eq", "/user-profile");
  });

  it('Muestra mensaje de "Lista vacía" cuando el usuario no tiene mascotas', () => {
    expect(testUser).to.exist;
    cy.visit("/user-profile");
    cy.get("h2.text-xl.font-bold.mt-2", TIMEOUT).should(
      "contain.text",
      testUser.fullName
    );
    cy.contains("Tus Mascotas Registradas", TIMEOUT).should("be.visible");
    cy.url(TIMEOUT).should("include", "/user-profile");

    cy.contains("a", "Ver mi lista de mascotas", TIMEOUT).click();
    cy.wait(10000);
    cy.url(TIMEOUT).should("include", "/list-pets");

    cy.get(".grid", TIMEOUT).should("exist").and("be.visible");
    cy.wait(5000);

    cy.contains("Lista vacía", TIMEOUT).should("be.visible");
  });

  it("Cargar mascotas para el nuevo usuario", () => {
    cy.visit("/user-profile");

    cy.intercept("GET", `**/species?page=1`).as("getSpecies");
    cy.intercept("GET", `**/race?*`).as("getRaces");
    cy.intercept("POST", `**/pet`).as("registerPet");

    cy.log("Verificando la navegación hacia la página de agregar mascota");
    cy.contains("button", "Agregar Mascota").click();

    registrarPet(petData);
  });

  it("Muestra la lista de mascotas y permite filtrar, limpiar, cambiar de vista y navegar", () => {
    cy.intercept("GET", "**/user-profile*").as("getUserProfile");
    cy.intercept("GET", "**/pet*").as("getPets");

    cy.visit("/user-profile");
    expect(testUser).to.exist;

    cy.get("h2.text-xl.font-bold.mt-2", TIMEOUT).should(
      "contain.text",
      testUser.fullName
    );
    cy.contains("Tus Mascotas Registradas", TIMEOUT).should("be.visible");
    cy.url(TIMEOUT).should("include", "/user-profile");

    cy.contains("a", "Ver mi lista de mascotas", TIMEOUT).click();
    cy.wait(10000);
    cy.url(TIMEOUT).should("include", "/list-pets");

    cy.get(".grid", TIMEOUT).should("exist").and("be.visible");
    cy.wait(3000);

    // Cambio de vista
    cy.get("div.w-auto.flex.gap-2.items-center.justify-end").within(() => {
      cy.get("button").eq(1).click();
    });
    cy.wait(5000);
    cy.get(".flex.flex-col.space-y-4.pb-10", TIMEOUT).should("exist");

    cy.get("div.w-auto.flex.gap-2.items-center.justify-end").within(() => {
      cy.get("button").eq(0).click();
    });
    cy.wait(5000);
    cy.get(".grid", TIMEOUT).should("exist");

    cy.get('input[type="text"]', TIMEOUT).clear().type("kira"); // Filtra
    cy.wait(5000);

    cy.contains("Limpiar", TIMEOUT).click();
    cy.wait(5000);
    cy.get('input[type="text"]', TIMEOUT).should("have.value", "");

    cy.get('a[href*="/detalle-mascota/"]', TIMEOUT)
      .should("have.length.greaterThan", 0)
      .first()
      .click();
    cy.wait(10000);
    cy.url(TIMEOUT).should("include", "/detalle-mascota/");
  });
});
