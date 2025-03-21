describe('Pantalla de Servicios', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/servicios');
  });

  it('Debería mostrar el título principal y subtítulo correctamente', () => {
    cy.contains('Nuestros servicios').should('be.visible');
    cy.contains('Explora nuestros servicios').should('be.visible');
  });

  it('Debería renderizar todas las tarjetas de servicio', () => {
    ['Veterinaria', 'Peluquería', 'Castración'].forEach(servicio => {
      cy.contains(servicio).should('be.visible');
    });
  });

  it('El botón de CTA en cada tarjeta debe redirigir correctamente', () => {
    cy.get('a:contains("Más información")')
      .each(($el) => cy.wrap($el).should('have.attr', 'href').and('include', '/'))
      .first()
      .click();
    cy.url().should('not.include', '/servicios');
  });

  it('El carrusel debe mostrar imágenes y cambiar al hacer clic en la flecha derecha', () => {
    cy.get('div.flex.gap-4.w-full.justify-center')
      .first()
      .find('img')
      .first()
      .invoke('attr', 'src')
      .then((srcAntes) => {
        cy.get('button[class*="right-0"]').first().click();
        cy.wait(500);
        cy.get('div.flex.gap-4.w-full.justify-center img')
          .first()
          .invoke('attr', 'src')
          .should('not.equal', srcAntes);
      });
  });

  it('El diseño es responsivo en dispositivos móviles, ocultando la segunda imagen del carrusel', () => {
    cy.viewport('iphone-6');
    cy.get('div.flex.gap-4.w-full.justify-center')
      .first()
      .find('img')
      .eq(1)
      .should('not.be.visible');
  });
});
