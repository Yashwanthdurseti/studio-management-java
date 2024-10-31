describe('Duplicate Class Name Validation', () => {
    beforeEach(() => {
        // Visit the app before each test
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/');
   
    });

    it('should show a validation error for duplicate class name', () => {
        // Attempt to create another class with the same name
        cy.get('#class-name').type('Yoga Class');
        cy.get('#start-date').type('2024-12-01', { force: true });
        cy.get('#end-date').type('2024-12-31', { force: true });
        cy.get('#capacity').type('25');

        // Click on "Create Class" button
        cy.get('#create-class-form button[type="submit"]').click();

        // Check that the modal pops up with a duplicate class name error
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Validation Error');
        cy.get('#modal-message').should('contain', 'Class Name already exists');

        // Close the modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
