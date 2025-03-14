import { Header } from '@/components/admin/Header';

describe('Header Component', () => {
  it('Se muestra correctamente con el nombre completo del usuario', () => {
    const fullName = 'Juan Pérez';
    
    cy.mount(<Header fullName={fullName} />);

    cy.contains(fullName).should('exist');
    cy.contains('Bienvenido al panel de administración').should('exist');

    cy.get('img')
      .should('have.attr', 'src')
      .and('include', 'blank-profile-picture');

    cy.get('h2').should('have.class', 'text-xl');
  });
});
