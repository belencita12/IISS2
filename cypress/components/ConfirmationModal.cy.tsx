import React from 'react'
import { ConfirmationModal } from '@/components/global/Confirmation-modal'



describe('<ConfirmationModal />', () => {
    let onClose: Cypress.Agent<sinon.SinonStub>
    let onConfirm: Cypress.Agent<sinon.SinonStub>

    beforeEach(() => {
        // Creamos los stubs 
        onClose = cy.stub().as('onClose')
        onConfirm = cy.stub().as('onConfirm')
      })

  it('se muestra correctamente con las propiedades predeterminadas', () => {
 
    cy.mount(
      <ConfirmationModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    cy.wait(2000)
    // Verifica que el título y el mensaje aparezcan
    cy.contains('¿Estás seguro?').should('exist')
    cy.contains('Esta acción no se puede deshacer.').should('exist')

    // Botones
    cy.contains('Cancelar').should('exist')
    cy.contains('Confirmar').should('exist')
  })

  it('ejecuta onClose cuando se pulsa el botón de cancelar', () => {
    cy.mount(
      <ConfirmationModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    cy.wait(2000)

    cy.contains('Cancelar').click()
    cy.get('@onClose').should('have.been.calledOnce')
  })

  it('ejecuta onConfirm y onClose al hacer clic en el botón confirmar', () => {
    cy.mount(
      <ConfirmationModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    cy.wait(2000)
    cy.contains('Confirmar').click()

    cy.get('@onConfirm').should('have.been.calledOnce')
    cy.get('@onClose').should('have.been.calledOnce')
  })

  it('renderiza correctamente las propiedades personalizadas', () => {
    cy.mount(
      <ConfirmationModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Eliminar usuario"
        message="¿Seguro que quieres eliminar este usuario?"
        confirmText="Sí, eliminar"
        cancelText="No, cancelar"
        variant="warning"
      />
    )
    cy.wait(2000)
    cy.contains('Eliminar usuario').should('exist')
    cy.contains('¿Seguro que quieres eliminar este usuario?').should('exist')

    cy.contains('Sí, eliminar').should('exist')
    cy.contains('No, cancelar').should('exist')

    // Asegurarse que el icono tenga el color correcto de warning (bg-yellow-100)
    cy.get('div.bg-yellow-100').should('exist')
  })
})
