describe('Book a Class', () => {
    beforeEach(() => {
        // Visit the app
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/'); 
    });

    it('should book a class and display a success modal', () => {
        // Define the target booking date
        const bookingDate = '2024-12-07'; // Set December 5, 2024, directly

        // Select "Book Class" section
        cy.get('#class-select').select('Yoga Class');
        
        // Set the booking date directly in the date input field
        cy.get('#date-picker').invoke('val', bookingDate);

        // Fill in the rest of the form
        cy.get('#member-name').type('Dermot Herlihy');

        // Submit the booking form
        cy.get('#booking-form button[type="submit"]').click();

        // Check that the success modal pops up
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Booking Successful');

        // Close the modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
