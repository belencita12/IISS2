import React from "react";
import GenericPagination from "@/components/global/GenericPagination"; // Ajusta la ruta según tu estructura

describe("GenericPagination Component", () => {
    const setup = (currentPage = 1, totalPages = 5) => {
        cy.mount(
            <GenericPagination
                handlePreviousPage={cy.spy().as("prevPage")}
                handleNextPage={cy.spy().as("nextPage")}
                handlePageChange={cy.spy().as("changePage")}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        );
    };

    it("debe renderizar correctamente cuando hay más de una página", () => {
        setup();
        cy.get("nav").should("exist"); // Asegura que la paginación se renderiza
    });

    it("deshabilita los botones prev y first en la primera página", () => {
        setup(1, 5);
        cy.get("a")
            .filter("[aria-disabled='true'], .pointer-events-none")
            .should("have.length", 2);
    });

    it("deshabilita los botones next y last en la última página", () => {
        setup(5, 5);
        cy.get("a")
            .filter("[aria-disabled='true'], .pointer-events-none")
            .should("have.length", 2);
    });

    it("cambia de página al hacer clic en un número de página", () => {
        setup(1, 5);
        cy.get("a").contains("3").click();
        cy.get("@changePage").should("have.been.calledWith", 3);
    });

    it("navega a la página anterior", () => {
        setup(3, 5); // Esto establece que estás en la página 2 de 5
        cy.get("a").contains("2").click();
        cy.get("@changePage").should("have.been.calledWith", 2);
    });
    

    it("navega a la página siguiente", () => {
        setup(2, 5);
        cy.get("a").contains("4").click();
        cy.get("@changePage").should("have.been.calledWith", 4);

    });
});
