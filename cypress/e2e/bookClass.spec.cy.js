describe('Book a Class', () => {
    beforeEach(() => {
        // Visit the app
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/'); 
    });

    it('should book a class and display a success modal', () => {
        // Select "Book Class" section
        cy.get('#class-select').select('Yoga Class');
        cy.get('#date-picker').type('2024-11-05', { force: true });
        cy.get('#member-name').type('Dermot Herlihy');

        // Click on "Book Class" button
        cy.get('#booking-form button[type="submit"]').click();

        // Check that the success modal pops up
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Booking Successful');
        // cy.get('#modal-message').should('contain', 'Your booking was successful!'); // Verify content if needed

        // Close the modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
