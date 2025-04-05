describe('Filtros en página de Razas', () => {
  beforeEach(() => {
    cy.visit('/razas') // o la ruta real
  })

  it('al tocar filtro de categoría cambia el query param', () => {
    cy.get('[data-cy="filter-category"]').select('Perros')  // suponiendo que hay un select

    cy.url().should('include', 'category=Perros')
  })

  it('al cambiar página, cambia query param', () => {
    cy.get('[data-cy="pagination-next"]').click()

    cy.url().should('include', 'page=2')
  })
})
