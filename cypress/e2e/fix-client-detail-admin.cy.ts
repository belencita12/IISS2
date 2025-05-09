describe('ClientListSection', () => {
  const SESSION_KEY = "sessionToken";
  const USER = {
    email:  Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A")
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
      cy.wait(5000);
      cy.url().should('include', '/dashboard');
    });
    cy.visit('/dashboard/clients');
    cy.url().should('include', '/dashboard/clients');
    cy.wait(5000);
  });

  it('Debe abrir el perfil del cliente desde el icono del ojo', () => {
    cy.get(':nth-child(2) > .text-right > [aria-label="Ver detalles"]').first().click();
    cy.wait(20000);
    cy.url().should('include', '/dashboard/clients/');
    cy.contains('Perfil de Cliente').should('be.visible');
  });

  it('Debe mostrar la sección de Mascotas del cliente', () => {
    cy.get(':nth-child(2) > .text-right > [aria-label="Ver detalles"]').first().click();
    cy.wait(20000);
    cy.contains('Mascotas').should('be.visible');
  });

  it('Debe mostrar la sección de Citas del cliente', () => {
    cy.get(':nth-child(2) > .text-right > [aria-label="Ver detalles"]').first().click();
    cy.wait(20000);
    cy.contains('Citas del Cliente').should('be.visible'); 
  });
});
