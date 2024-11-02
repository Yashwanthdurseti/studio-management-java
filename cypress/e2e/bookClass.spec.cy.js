describe('Book a Class', () => {
    before(() => {
        // Visit the app and check if "Yoga Class" exists
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/');

        // Check if "Yoga Class" exists in the dropdown
        cy.get('#class-select').then(select => {
            if (!select.text().includes('Yoga Class')) {
                // If "Yoga Class" doesn't exist, attempt to create it
                cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/'); // Navigate to create class page
                
                // Fill in the create class form
                cy.get('#class-name').type('Yoga Class');
                cy.get('#start-date').type('2024-12-01', { force: true }); // Start date for December
                cy.get('#end-date').type('2024-12-31', { force: true });   // End date for December
                cy.get('#capacity').type('20');
                
                // Submit the form to create the class
                cy.get('#create-class-form button[type="submit"]').click();

                // Wait for any modal to appear
                cy.wait(1000);

                // Check for modal content to determine if it's a validation error
                cy.get('body').then(($body) => {
                    if ($body.find('#modal-title').text().includes('Validation Error')) {
                        // Validation error modal is present, skip creation
                        cy.log('Validation Error: Class name already exists, proceeding to booking.');
                        cy.get('.modal-dialog').within(() => {
                            cy.get('button').contains('OK').click(); // Close the validation modal
                        });
                    } else if ($body.find('#modal-title').text().includes('Class Created')) {
                        // Success modal is present
                        cy.get('#success-modal').should('be.visible');
                        cy.get('#modal-title').should('have.text', 'Class Created');
                        cy.get('#success-modal').within(() => {
                            cy.get('button').contains('OK').click(); // Close the success modal
                        });
                    }
                });
            }
        });
    });

    beforeEach(() => {
        // Visit the main app page for booking
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/'); 
    });

    it('should book a class and display a success modal', () => {
        // Define the target booking date
        const bookingDate = '2024-12-07'; // Set December 7, 2024, as the booking date

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
