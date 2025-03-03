describe("Registro de usuario", () => {
  
    beforeEach(() => {
      cy.visit("/register");
      cy.url().should("include", "/register");
    });
  
    it("Debe validar que el campo 'name' esté lleno antes de enviar el formulario", () => { // no completamos el campo 'name'
      cy.get("input[name='lastname']").type("Ramirez");
      cy.get("input[name='email']").type("ramirez@gmail.com");
      cy.get("input[name='password']").type("ramirez123");
      cy.get("input[name='confirmPassword']").type("ramirez123");
  
      cy.get("form").submit();
      cy.wait(800); 
      cy.contains("Todos los campos son obligatorios.", { timeout: 10000 }).should("be.visible");
    });
  
    it("Debe validar que el campo 'lastname' esté lleno antes de enviar el formulario", () => { // no completamos el campo 'lastname'
      cy.get("input[name='name']").type("Ian");
      cy.get("input[name='email']").type("ramirez@gmail.com");
      cy.get("input[name='password']").type("ramirez123");
      cy.get("input[name='confirmPassword']").type("ramirez123");
  
      cy.get("form").submit();
      cy.wait(800); 
      cy.contains("Todos los campos son obligatorios.", { timeout: 10000 }).should("be.visible");
    });
  
    it("Debe validar que el campo 'password' esté lleno antes de enviar el formulario", () => { // no completamos el campo 'password'
      cy.get("input[name='name']").type("Ian");
      cy.get("input[name='lastname']").type("Ramirez");
      cy.get("input[name='email']").type("ramirez@gmail.com");
      cy.get("input[name='confirmPassword']").type("ramirez123");
  
      cy.get("form").submit();
      cy.wait(800); 
      cy.contains("Todos los campos son obligatorios.", { timeout: 10000 }).should("be.visible");
    });
  
    it("Debe validar que el campo 'email' esté lleno antes de enviar el formulario", () => { // no completamos el campo 'email'
      cy.get("input[name='name']").type("Ian");
      cy.get("input[name='lastname']").type("Ramirez");
      cy.get("input[name='password']").type("ramirez123");
      cy.get("input[name='confirmPassword']").type("ramirez123");
  
      cy.get("input[name='email']").focus().blur();
      cy.wait(800); 
      cy.contains("Por favor, introduce un email válido. Ej: juanperez@gmail.com", { timeout: 10000 }).should("be.visible");
    });
  
    it("Debe mostrar error si el correo electrónico tiene un formato inválido", () => { 
      cy.get("input[name='name']").type("Ian");
      cy.get("input[name='lastname']").type("Ramirez");
      cy.get("input[name='email']").type("ianramirez.com");  
      cy.get("input[name='password']").type("ramirez123");
      cy.get("input[name='confirmPassword']").type("ramirez123");
  
      cy.get("form").submit();
      cy.wait(800); 
      cy.contains("Por favor, introduce un email válido. Ej: juanperez@gmail.com", { timeout: 10000 }).should("be.visible");
    });
  
    it("Debe validar que las contraseñas coincidan antes de enviar", () => {
      cy.get("input[name='name']").type("Ian");
      cy.get("input[name='lastname']").type("Ramirez");
      cy.get("input[name='email']").type("ramirez@gmail.com");
      cy.get("input[name='password']").type("ramirez123");
      cy.get("input[name='confirmPassword']").type("ramirez");
  
      cy.get("form").submit();
      cy.wait(800); 
      cy.contains("Las contraseñas no coinciden", { timeout: 10000 }).should("be.visible");
    });
  
    it("Debe registrar un usuario exitosamente", () => {
      cy.get("input[name='name']").type("Lourdes");
      cy.get("input[name='lastname']").type("Valenzuela");
      cy.get("input[name='email']").type("lourdes@gmail.com");
      cy.get("input[name='password']").type("lourdes");
      cy.get("input[name='confirmPassword']").type("lourdes");
  
      cy.get("form").submit();
      cy.wait(800); 
      cy.contains("Registro exitoso. Redirigiendo...", { timeout: 10000 }).should("be.visible");
      
      cy.wait(2000); 
      cy.url().should("include", "/login");
    });
  
    it("Debe mostrar error si el correo ya está registrado", () => {
      cy.get("input[name='name']").type("Emma");
      cy.get("input[name='lastname']").type("Gimenez");
      cy.get("input[name='email']").type("lourdes@gmail.com");
      cy.get("input[name='password']").type("emma123");
      cy.get("input[name='confirmPassword']").type("emma123");
  
      cy.get("form").submit();
      cy.wait(800); 
      cy.contains("Las credenciales ya están en uso. Intente con datos diferentes", { timeout: 10000 }).should("be.visible");
    });
  });