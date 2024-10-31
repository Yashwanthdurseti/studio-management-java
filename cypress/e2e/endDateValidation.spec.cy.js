describe('End Date Validation', () => {
    beforeEach(() => {
        // Visit the app before each test
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/');
    });

    it('should show a validation error when end date is before start date', () => {
        // Input the class name
        cy.get('#class-name').type('Pilates Class');
        
        // Enter the start date
        cy.get('#start-date').type('2024-11-10', { force: true });
        
        // Enter an end date that is before the start date
        cy.get('#end-date').type('2024-11-01', { force: true });
        
        // Enter the class capacity
        cy.get('#capacity').type('15');

        // Click on "Create Class" button
        cy.get('#create-class-form button[type="submit"]').click();

        // Check that the modal pops up with an end date validation error
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Validation Error');
        cy.get('#modal-message').should('contain', 'Invalid Date - End date must be the same as or after the start date');

        // Close the modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
