// cypress/component/useQuery.cy.tsx
import { mount } from 'cypress/react'
//import {TestQueryComponent} from '@/components/TestQueryComponent'

describe('useQuery Hook', () => {
  beforeEach(() => {
   // mount(<TestQueryComponent />)
  })

  it('debe mostrar la query inicial', () => {
    cy.get('[data-cy=query-string]').should('contain', 'page=1&category=vacuna')
  })

  it('debe actualizar la query al hacer click', () => {
    cy.get('[data-cy=set-category]').click()
    cy.get('[data-cy=query-string]').should('contain', 'page=1&category=productos')
  })
})
