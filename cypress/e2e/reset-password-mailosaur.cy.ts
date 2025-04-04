describe("Recuperación de contraseña", () => {
  const newPassword = "NuevaContrasenha123";
  const validEmail = Cypress.env("MAILOSAUR_EMAIL");
  const serverId = Cypress.env("MAILOSAUR_SERVER_ID");
  const TIMEOUT = { timeout: 15000 };

  it('Verificar si la variable de entorno "MAILOSAUR_API_KEY" se ha establecido', () => {
    expect(Cypress.env("MAILOSAUR_API_KEY")).to.exist;
  });

  it("Crear el usuario en caso de que no exista", () => {
    cy.intercept("POST", "**/auth/signup").as("register");
    cy.generateUser().then((user) => {
      const testUser = { ...user, email: `${Date.now()}${validEmail}` };
      cy.register(testUser);
      cy.wait("@register", TIMEOUT);
    });
  });

  it("envía un correo con enlace de recuperación de contrasenha", () => {
    cy.visit("/forgot-password");
    cy.get('input[id="email"]').type(validEmail);
    cy.get('button[type="submit"]').click();

    cy.contains("Email enviado correctamente", TIMEOUT).should("be.visible");
  });

  it("obtiene el token de Mailosaur y restablece la contrasenha", () => {
    cy.mailosaurGetMessage(serverId, { sentTo: validEmail }).then((message) => {
      expect(message).not.to.be.undefined;
      expect(message.subject).to.include("Password reset");

      expect(message.html).not.to.be.undefined;
      const resetLink = message.html?.links?.find((link) =>
        link.href?.includes("reset-password")
      );
      expect(resetLink).to.exist;
      const resetToken = new URL(resetLink!.href!).searchParams.get("token");

      Cypress.env("resetToken", resetToken);
    });
  });

  it("restablece la contrasenha y redirecciona a login", () => {
    const resetToken = Cypress.env("resetToken") as string;

    expect(resetToken).to.exist;

    cy.visit(`/reset-password?token=${resetToken}`);

    cy.get('input[id="password"]').type(newPassword);
    cy.get('input[id="confirmPassword"]').type(newPassword);
    cy.get('button[type="submit"]').click();

    cy.contains("Contraseña restablecida con éxito", {
      timeout: 10000,
    }).should("be.visible");

    cy.url(TIMEOUT).should("include", "/login");
  });
});
