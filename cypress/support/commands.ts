/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

type BaseUser = {
  fullName: string;
  email: string;
  password: string;
};

Cypress.Commands.add("generateUser", (): Cypress.Chainable<BaseUser> => {
  const fullName = `Test User${Date.now()}`;
  const email = `${fullName}@gmail.com`;
  const password = "12345678";

  return cy.wrap({
    fullName,
    email,
    password,
  });
});

Cypress.Commands.add("register", (user: BaseUser): void => {
  const names = user.fullName.split(" ");
  cy.visit("/register");
  if (names[0] && names[0] !== "") cy.get("input[name='name']").type(names[0]);
  if (names[1] && names[1] !== "")
    cy.get("input[name='lastname']").type(names[1]);
  if (user.email.length > 0) cy.get("input[name='email']").type(user.email);
  if (user.password.length > 0)
    cy.get("input[name='password']").type(user.password);
  if (user.password.length > 0)
    cy.get("input[name='confirmPassword']").type(user.password);
  cy.get("button").contains("Registrarme").click();
});

Cypress.Commands.add(
  "loginAndSetSession",
  (key: string, email: string, password: string): void => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("login");

    cy.visit("/login");
    cy.url().should("include", "/login");

    cy.get("input[name='email']").type(email, { log: false });
    cy.get("input[name='password']").type(password, {
      log: false,
    });
    cy.contains("Iniciar Sesión").click();

    cy.wait("@login").then((interception) => {
      if (interception.response?.statusCode === 200) {
        cy.getCookie("next-auth.session-token")
          .should("exist")
          .then((cookie) => {
            if (cookie) Cypress.env(key, cookie.value);
          });
      }
    });
  }
);

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    loginAndSetSession(key: string, email: string, password: string): void;
    generateUser(): Cypress.Chainable<BaseUser>;
    register(user: BaseUser): void;
  }
}
