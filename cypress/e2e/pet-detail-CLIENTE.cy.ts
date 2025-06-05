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
        cy.visit("/user-profile/pet/43"); // usa un ID válido que tenga datos reales
    });


    it("Debe mostrar correctamente la información de la mascota", () => {
        cy.visit("/user-profile/pet/43");

        // Espera a que cargue el nombre
        cy.get("h2").should("contain.text", "Curly");

        // Validar edad con badge que diga "Años"
        cy.contains(/años?/i).should("exist");

        // Validar especie
        cy.contains("Especie").parentsUntil("div.grid").parent().should("contain.text", "Perro");

        // Validar raza
        cy.contains("Raza").parentsUntil("div.grid").parent().should("contain.text", "Mestizo");

        cy.contains(/Hembra|Macho/i).should("exist");



    });


    it("Debe mostrar correctamente las tablas de vacunas y citas", () => {

        // Sección Control de Vacunas
        cy.contains("Control de Vacunas").should("exist");

        // Cambiar a pestaña de Citas
        cy.contains("Citas").click();

        // Verificar que existen filas de citas
        cy.get("table").should("contain.text", "Pendiente");
    });




});
