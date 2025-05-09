describe("Página de Lista de Productos", () => {
  const SESSION_KEY = "sessionToken";

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    const sessionToken: string = Cypress.env(SESSION_KEY);
    if (sessionToken) cy.setCookie("next-auth.session-token", sessionToken);

    cy.intercept("GET", "/dashboard/products", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Producto A",
          price: 100,
          stock: 10,
        },
        {
          id: 2,
          name: "Producto B",
          price: 200,
          stock: 5,
        },
      ],
    }).as("getProducts");
  });

  it("login", () => {
    const USER = {
      email: Cypress.env("USER_EMAIL_A"),
      password: Cypress.env("USER_PASSWORD_A"),
    };

    cy.loginAndSetSession(SESSION_KEY, USER.email, USER.password);
  });

  it("Debe mostrar el listado de productos si existen", () => {
    cy.visit("/dashboard");

    cy.contains("p", "Productos").click();
    cy.wait(10000);
    cy.contains("Productos").should("exist");

    cy.get(":nth-child(1) > .gap-2 > .truncate", { timeout: 10000 })
      .should("be.visible")
      .click();
  });
/*
  it("Navega al detalle de un producto al hacer click en la card", () => {
    cy.visit("/dashboard");
    cy.contains("p", "Productos").click();

    cy.get('div[class*="bg-card"]')
      .first()
      .within((parent) => {
        const $img = parent.find("img");
        const $div = parent.find(
          'div[class="w-full h-full flex items-center justify-center bg-gray-200 rounded"]'
        );

        if ($img.length > 0) {
          cy.log("Found an <img>, clicking...");
          cy.wrap($img.first()).click();
        } else if ($div.length > 0) {
          cy.log("No <img>, but found <div>, clicking...");
          cy.wrap($div.first()).click();
        } else {
          cy.log("No <img> or <div> found.");
        }
      });
  });
*/
  it("Filtra productos por código", () => {
    cy.visit("/dashboard");
    cy.contains("p", "Productos").click();
    cy.wait(10000);
    cy.get('input[placeholder="Buscar por código o nombre del producto"]').type(
      "174632436533638"
    );
    cy.wait(10000);
    cy.get('div[class*="bg-card"]').should("have.length", 1);
    cy.contains("Correa para Hamsters").should("exist");
    cy.get('input[placeholder="Buscar por código o nombre del producto"]').clear();
    cy.wait(3000);
  });

  it("Filtra productos por etiqueta", () => {
    cy.visit("/dashboard");
    cy.contains("p", "Productos").click();
    cy.wait(5000);
    cy.contains('button[role="combobox"]', "Etiqueta").click({ force: true });
    cy.get('[data-state="open"]').contains("correa").click();
    cy.get("div.animate-pulse").should("not.exist");
    cy.get('div[class*="bg-card"]')
      .should("have.length.at.most", 16)
      .each(($card) => {
        cy.wrap($card).should("be.visible");
        cy.wrap($card).invoke("text").should("include", "correa");
      });
  });

  it("Filtra productos por precio", () => {
    cy.visit("/dashboard");
    cy.contains("p", "Productos").click();
    cy.wait(10000);
    cy.get('input[placeholder="Desde"]').eq(0).type("20000");
    cy.get('input[placeholder="Hasta"]').eq(0).type("30000");
    cy.wait(10000);
    cy.get('div[class*="bg-card"]').should("have.length.at.least", 2);
    cy.wait(10000);
  });
  it("Filtra productos por costo", () => {
    cy.visit("/dashboard");
    cy.contains("p", "Productos").click();
    cy.wait(10000);
    cy.get('input[placeholder="Desde"]').eq(1).type("10000");
    cy.get('input[placeholder="Hasta"]').eq(1).type("15000");
    cy.wait(10000);
    cy.get('div[class*="bg-card"]').should("have.length.at.least", 2);
    cy.wait(10000);
  });


  it("Filtra productos por nombre", () => {
    cy.visit("/dashboard");
    cy.contains("p", "Productos").click();
    cy.wait(10000);
    cy.get('input[placeholder="Buscar por código o nombre del producto"]').type(
      "Correa",{ delay: 2000 }
    );
    cy.get("div.animate-pulse", { timeout: 25000 }).should("not.exist");
    cy.contains("Correa", { matchCase: false }).should("be.visible");
    cy.get('input[placeholder="Buscar por código o nombre del producto"]').clear();
    cy.wait(5000);
  });

});
