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

    cy.location("pathname").should("eq", "/user-profile");
  }
);

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    loginAndSetSession(key: string, email: string, password: string): void;
  }
}
