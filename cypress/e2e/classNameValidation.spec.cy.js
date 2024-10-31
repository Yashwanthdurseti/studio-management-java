describe('Class Name Validation', () => {
    beforeEach(() => {
        // Visit the app before each test
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/');
    });

    it('should show a validation error for invalid class name', () => {
        // Interact with Create Class fields with an invalid class name (e.g., numbers or special characters)
        cy.get('#class-name').type('Yoga123!');
        cy.get('#start-date').type('2024-11-01', { force: true });
        cy.get('#end-date').type('2024-11-30', { force: true });
        cy.get('#capacity').type('15');

        // Click on "Create Class" button
        cy.get('#create-class-form button[type="submit"]').click();

        // Check that the modal pops up with a validation error message
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Validation Error');
        cy.get('#modal-message').should('contain', 'Please enter a valid Class Name (only letters and spaces allowed)');

        // Close the modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
