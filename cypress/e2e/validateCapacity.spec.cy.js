describe('Validate Capacity Field', () => {
    beforeEach(() => {
        // Visit the app
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/');
    });

    it('should show a validation modal if capacity is invalid (less than 1)', () => {
        // Fill in the Create Class form with invalid capacity
        cy.get('#class-name').type('Yoga Class');
        cy.get('#start-date').type('2024-11-01', { force: true });
        cy.get('#end-date').type('2024-11-30', { force: true });
        cy.get('#capacity').type('0'); // Enter invalid capacity

        // Click on "Create Class" button
        cy.get('#create-class-form button[type="submit"]').click();

        // Check for validation error modal
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Validation Error');
        cy.get('#modal-message').should('contain', 'Capacity must be greater than 0');

        // Close the modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
