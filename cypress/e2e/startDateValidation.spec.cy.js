describe('Start Date Validation', () => {
    beforeEach(() => {
        // Visit the app before each test
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/');
    });

    it('should show a validation error when start date is in the past', () => {
        // Input the class name
        cy.get('#class-name').type('Dance Class');

        // Enter a past start date
        cy.get('#start-date').type('2023-10-10', { force: true });

        // Enter a valid end date
        cy.get('#end-date').type('2024-11-30', { force: true });

        // Enter the class capacity
        cy.get('#capacity').type('20');

        // Click on "Create Class" button
        cy.get('#create-class-form button[type="submit"]').click();

        // Check that the modal pops up with a start date validation error
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Validation Error');
        cy.get('#modal-message').should('contain', 'The start date should be either today or a future day, not a past day');

        // Close the modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
