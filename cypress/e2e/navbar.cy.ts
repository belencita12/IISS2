describe("Navbar", () => {
    it("Navegar por los enlaces del navbar cuando no estás autenticado", () => {
      cy.visit("/");
      const links = [
        { label: "Inicio", path: "/" },
        { label: "Nosotros", path: "/nosotros" },
        { label: "Servicios", path: "/servicios" },
        { label: "Tienda", path: "/tienda" }
      ];
      
      links.forEach(link => {
        cy.contains(link.label).click();
        cy.location('pathname').should('include', link.path);
      });
    });
  
    it("Navegar por los enlaces del navbar cuando estás autenticado y cerrar sesión", () => {
      cy.visit("/login");
      cy.get("input[name='email']").type("test1@gmail.com");
      cy.get("input[name='password']").type("lourdes123");
      cy.get("button[type='submit']").click();
      cy.wait(3000);
  
      const links = [
        { label: "Inicio", path: "/" },
        { label: "Mi Perfil", path: "/user-profile" },
        { label: "Nosotros", path: "/nosotros" },
        { label: "Servicios", path: "/servicios" },
        { label: "Tienda", path: "/tienda" }
      ];
  
      links.forEach(link => {
        cy.contains(link.label).click();
        cy.location('pathname').should('include', link.path);
      });
  
      cy.contains("Cerrar sesión").click();
      cy.location('pathname').should('include', '/');
    });
  });