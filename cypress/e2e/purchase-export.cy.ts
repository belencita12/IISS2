describe("Reporte de compras - Admin", () => {
  const SESSION_KEY = "adminSession";
  const USER = {
    email: Cypress.env("USER_EMAIL_A"),
    password: Cypress.env("USER_PASSWORD_A"),
  };

  beforeEach(() => {
    cy.session(SESSION_KEY, () => {
      cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
    });
    cy.visit("/dashboard/purchases");
  });

  it("Debe mostrar los filtros correctamente", () => {
    cy.get('input[type="date"]#from').should("exist").and("be.visible");
    cy.get('input[type="date"]#to').should("exist").and("be.visible");
    cy.contains("button", "Exportar").should("exist").and("be.visible");
  });

  it("Debe activar el botón Exportar al ingresar fechas válidas", () => {
    cy.get('input[type="date"]#from').invoke("val", "2025-05-01").trigger("change");
    cy.get('input[type="date"]#to').invoke("val", "2025-05-20").trigger("change");

    cy.contains("button", "Exportar").should("not.be.disabled").click();
  });

  it("Debe generar un PDF correctamente con fechas válidas", () => {
    const startDate = "2025-05-01";
    const endDate = "2025-05-20";

    // Interceptar carga completa de compras
    cy.intercept("GET", "**/purchase?page=**").as("getPurchases");

    // Esperar a que la lista esté completamente cargada
    cy.wait("@getPurchases");

    // Asegurarse que los inputs existan
    cy.get('input[type="date"]#from').should("exist").and("be.visible");
    cy.get('input[type="date"]#to').should("exist").and("be.visible");

    // Establecer fechas con cambio disparado
    cy.get('input[type="date"]#from').invoke("val", startDate).trigger("change");
    cy.get('input[type="date"]#to').invoke("val", endDate).trigger("change");

    // Forzar blur (importante si el botón se habilita después de cambiar focus)
    cy.get("body").click(0, 0);

    // Verificar que el botón esté habilitado
    cy.contains("button", "Exportar").should("not.be.disabled");

    // Interceptar la llamada real al reporte (ajustá si es POST u otro endpoint exacto)
    cy.intercept("GET", "**/purchase/report**").as("getReport");

    // Click
    cy.contains("button", "Exportar").click();

    
  });


});
