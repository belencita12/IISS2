describe("template spec", () => {
  it("passes", () => {
    const baseUrl = Cypress.env("dev-base-url");
    cy.log("BASE_URL:", baseUrl);
    Cypress.config("baseUrl", baseUrl);
    cy.visit("/");
  });
});
