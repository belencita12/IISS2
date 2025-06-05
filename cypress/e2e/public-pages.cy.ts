describe("Páginas públicas accesibles sin login", () => {
  const publicRoutes = [
    { path: "/shop", title: "Tienda NicoPets" },
    { path: "/terms", title: "Términos y condiciones" },
    { path: "/contact", title: "Contacto" },
  ];

  publicRoutes.forEach(({ path, title }) => {
    it(`Debe permitir acceder a ${path} sin login y mostrar contenido`, () => {
      cy.visit(path);

      // Verifica que la página cargó correctamente
      cy.contains(title, { matchCase: false }).should("exist");

      // Verifica que no haya redirección al login
      cy.url().should("include", path);

      // Validar responsividad: simula dispositivos distintos
      cy.viewport("macbook-15");
      cy.contains(title, { matchCase: false }).should("be.visible");

      cy.viewport("iphone-6");
      cy.contains(title, { matchCase: false }).should("be.visible");

     
    });
  });
});
