describe('Create a Class', () => {
    beforeEach(() => {
        // Visit the app
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/'); 
    });

    it('should create a new class and display a success modal', () => {
        // Interact with Create Class fields
        cy.get('#class-name').type('Yoga Class');
        cy.get('#start-date').type('2024-11-01', { force: true }); // Sample start date
        cy.get('#end-date').type('2024-11-30', { force: true });   // Sample end date
        cy.get('#capacity').type('20');

        // Click on "Create Class" button
        cy.get('#create-class-form button[type="submit"]').click();

        // Check that the modal pops up with the success message
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Class Created');
       // cy.get('#modal-message').should('contain', 'Class created successfully!');

        // Close the modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
