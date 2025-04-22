import { mount } from 'cypress/react';
import NumericInput from '@/components/global/NumericInput';
describe("NumericInput", () => {
    it("debe renderizar correctamente un input de tipo texto", () => {
        mount(
            <NumericInput
                id="test-input"
                type="text"
                placeholder="Escribí algo"
                value=""
                onChange={() => { }}
            />
        );

        cy.get("input#test-input")
            .should("exist")
            .should("have.attr", "placeholder", "Escribí algo")
            .should("have.attr", "type", "text");
    });
    it("debe mostrar un mensaje de error si error está presente", () => {
        mount(
            <NumericInput
                id="with-error"
                type="number"
                placeholder="Error test"
                value=""
                error="Este campo es obligatorio"
            />
        );

        cy.get("p[title='mensaje de error']")
            .should("contain.text", "Este campo es obligatorio");
    });

    it("debe formatear el valor si es formattedNumber", () => {
        mount(
            <NumericInput
                id="formatted"
                type="formattedNumber"
                placeholder="Ej: 1.000,00"
                value={1234.56}
            />
        );

        cy.get("input#formatted")
            .should("have.value", "1.234,56");
    });
});