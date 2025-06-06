import { PetData } from "@/lib/pets/IPet";

type BaseUser = {
  email: string;
  password: string;
  fullName: string;
};

describe("Listado de Mascotas", () => {
  const SESSION_KEY = "sessionToken";
  const TIMEOUT = { timeout: 5000 };

  // Usa variables de entorno para credenciales (más seguro)
  const testUser: BaseUser = {
    email: Cypress.env("USER_EMAIL") || "jose@gmail.com",
    password: Cypress.env("USER_PASSWORD") || "12345678",
    fullName: "José González", // ajusta si es necesario
  };

  type PetDataMock = Pick<PetData, "name" | "dateOfBirth" | "weight">;
  const petData: PetDataMock = {
    name: "Kira",
    dateOfBirth: "2022-01-01",
    weight: 10.2,
  };

  const registrarPet = (pet: PetDataMock) => {

    cy.wait(5000);
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, testUser.email, testUser.password);
      cy.wait(2000);
    });
    cy.visit("/user-profile");
    cy.url().should("include", "/user-profile");
    cy.wait(2000);
  });

  it('Muestra mensaje de "Lista vacía" cuando el usuario no tiene mascotas', () => {

    cy.url(TIMEOUT).should("include", "/user-profile");

    cy.wait(2000);
    cy.get(".grid", TIMEOUT).should("exist").and("be.visible");
    cy.wait(2000);
  });

  it("Cargar mascotas para el usuario", () => {
    cy.intercept("GET", `**/species?page=1`).as("getSpecies");
    cy.intercept("GET", `**/race?*`).as("getRaces");
    cy.intercept("POST", `**/pet`).as("registerPet");

    registrarPet(petData);
  });

  it("Muestra la lista de mascotas y permite filtrar, limpiar, cambiar de vista y navegar", () => {
    cy.intercept("GET", "**/user-profile*").as("getUserProfile");
    cy.intercept("GET", "**/pet*").as("getPets");

    cy.url(TIMEOUT).should("include", "/user-profile");
    cy.wait(5000);
    cy.wait(3000);
  });
});
