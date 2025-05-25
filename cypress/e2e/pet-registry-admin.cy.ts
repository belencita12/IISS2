describe("Registro de Mascota - Admin", () => {
    const SESSION_KEY = "adminSession";
    const USER = {
        email: Cypress.env("USER_EMAIL_A"),
        password: Cypress.env("USER_PASSWORD_A"),
    };

    beforeEach(() => {
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
        });
        cy.visit("/dashboard/settings/pets/register");
    });

    it("Debe mostrar errores si se intenta registrar sin completar datos", () => {
        cy.contains("button", "Registrar Mascota").click();

        // Reemplazamos los textos por los correctos que se ven en la imagen
        cy.contains("Debes seleccionar un cliente").should("exist");
        cy.contains("El nombre es obligatorio").should("exist");
        cy.contains("La fecha de nacimiento es obligatoria").should("exist");
        cy.contains("Debes seleccionar un tipo de animal").should("exist");
        cy.contains("La raza es obligatoria").should("exist");
        cy.contains("El peso debe ser mayor a 0").should("exist");
        cy.contains("Debes seleccionar un género").should("exist");
    });


    it("Debe cargar razas al seleccionar una especie", () => {
        cy.contains("label", "Especie")
            .parent()
            .find("button")
            .click();

        // Seleccionamos una especie por nombre
        cy.get('[role="option"]').contains(/perro|gato/i).click();

        // Confirmamos que el select de raza se habilita
        cy.contains("label", "Raza")
            .parent()
            .find("button")
            .should("not.be.disabled")
            .click();

        cy.get('[role="option"]').should("have.length.greaterThan", 0);
    });

    it("Debe registrar correctamente una mascota con datos válidos", () => {
    // Buscar y seleccionar cliente
    cy.get('input[placeholder="Buscar cliente..."]').type("Annia", { delay: 100 });
    cy.wait(1000);
    cy.get('[role="option"]').first().click();

    // Nombre y fecha de nacimiento
    cy.get('input[name="name"]').type("Mascota Test");
    cy.get('input[name="dateOfBirth"]').type("2024-05-01");

    // Especie y raza
    cy.contains("label", "Especie")
  .parent()
  .find("button")
  .click();

cy.get('[role="option"]').first().click();

    cy.wait(1500); // esperar carga de razas
cy.contains("label", "Raza")
  .parent()
  .find("button")
  .click();

cy.get('[role="option"]').first().click();


    // Peso
    cy.get('input[name="weight"]').type("2");

    // Género
    cy.get("#sexFemale").click();

    // Enviar
    cy.contains("Registrar Mascota").click();

    // Redirección
    cy.url().should("include", "/dashboard/settings/pets");
  });


    it("Debe redirigir desde el botón 'Registrar Mascota' del listado", () => {
        cy.visit("/dashboard/settings/pets");

        cy.contains("Registrar Mascota").click();

        cy.url().should("include", "/dashboard/settings/pets/register");
    });
});
