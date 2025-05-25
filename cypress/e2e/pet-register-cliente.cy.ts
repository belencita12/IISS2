describe("Detalle de cita (cliente)", () => {
    const SESSION_KEY = "clientSession";
    const USER = {
        email: Cypress.env("USER_EMAIL"),
        password: Cypress.env("USER_PASSWORD"),
    };

    beforeEach(() => {
        cy.session(SESSION_KEY, () => {
            cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
        });
        cy.visit("/user-profile/pet/register"); // usa un ID válido que tenga datos reales
    });

    it("Debe mostrar errores si se intenta registrar sin completar datos", () => {

        cy.contains("button", "Registrar Mascota").click();

        cy.contains("El nombre es obligatorio").should("exist");
        cy.contains("La fecha de nacimiento es obligatoria").should("exist");
        cy.contains("La raza es obligatoria").should("exist");
        cy.contains("Debes seleccionar un tipo de animal").should("exist");
        cy.contains("Debes seleccionar un género").should("exist");
        cy.contains("El peso debe ser un número mayor a 0").should("exist");
    });

    it("Debe cargar razas al seleccionar una especie", () => {

        cy.contains("Animal").parent().find("button").click();
        cy.get('[role="option"]').first().click();

        cy.contains("Raza").parent().find("button").should("not.be.disabled").click();
        cy.get('[role="option"]').should("have.length.greaterThan", 0);
    });


    it("Debe registrar correctamente una mascota con datos válidos", () => {

        // Nombre
        cy.get('input[id="petName"]').type("Firulais");

        // Fecha
        cy.get('input[id="birthDate"]').type("2024-05-01");

        // Animal (especie)
        cy.get("#animalType").click();
        cy.get('[role="option"]').first().click();

        // Raza
        cy.wait(500); // esperar que cargue
        cy.get("#breed").click();
        cy.get('[role="option"]').first().click();

        // Peso
        cy.get('input[id="weight"]').type("5");

        // Género
        cy.get("#genderMale").click();

        // Enviar
        cy.contains("Registrar Mascota").click();

        // Redirección
        cy.url().should("include", "/user-profile");
    });



});
