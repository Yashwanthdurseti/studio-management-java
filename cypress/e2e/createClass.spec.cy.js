describe('Create a Class', () => {
    beforeEach(() => {
        // Visit the app
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/'); 
    });

    it('should create a new class if it does not already exist', () => {
        // Calculate dynamic dates
        const today = new Date();
        const startDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD for today's date
        const endDate = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0]; // 30 days from today

        // Open the "Create Class" form (if applicable)
        cy.get('#create-class-form').should('be.visible');

        // Check if "Yoga Class" already exists in the dropdown
        cy.get('#class-select').then((select) => {
            if (select.find('option').text().includes('Yoga Class')) {
                // Log message and skip creation if "Yoga Class" exists
                cy.log('Yoga Class already exists, skipping creation.');
            } else {
                // Interact with Create Class fields if the class does not exist
                cy.get('#class-name').type('Yoga Class'); 
                cy.get('#start-date').type(startDate, { force: true });
                cy.get('#end-date').type(endDate, { force: true });
                cy.get('#capacity').type('20');

                // Click on "Create Class" button
                cy.get('#create-class-form button[type="submit"]').click();

                // Handle potential validation error modal
                cy.get('body').then(($body) => {
                    if ($body.find('#validation-error-modal').length > 0) {
                        cy.log('Validation Error: Class name already exists, skipping further actions.');
                        cy.get('#validation-error-modal').within(() => {
                            cy.get('button').contains('OK').click(); // Close the modal
                        });
                    } else {
                        // Check that the success modal appears
                        cy.get('#success-modal').should('be.visible');
                        cy.get('#modal-title').should('have.text', 'Validation Error');
                        // Optional: Verify modal content
                        // cy.get('#modal-message').should('contain', 'Class created successfully!');

                        // Close the success modal
                        cy.get('#success-modal').within(() => {
                            cy.get('button').contains('OK').click();
                        });
                    }
                });
            }
        });
    });
});
