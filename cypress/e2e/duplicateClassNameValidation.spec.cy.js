describe('Duplicate Class Name Validation', () => {
    before(() => {
        // Visit the app to check if "Yoga Class" exists
        cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/');

        // Wait for the dropdown to fully load
        cy.get('#class-select').should('be.visible').wait(500);

        // Check if "Yoga Class" is available in the select dropdown
        cy.get('#class-select').then(select => {
            const classExists = select.find('option[value="Yoga Class"]').length > 0;
            
            if (!classExists) {
                // If "Yoga Class" is not present, create it once
                cy.visit('https://studio-management-java-6cd114f86749.herokuapp.com/');

                // Fill in the create class form
                cy.get('#class-name').type('Yoga Class');
                cy.get('#start-date').type('2024-12-01', { force: true });
                cy.get('#end-date').type('2024-12-31', { force: true });
                cy.get('#capacity').type('20');

                // Submit the form to create the class
                cy.get('#create-class-form button[type="submit"]').click();

                // Verify success modal and close it
                cy.get('#success-modal').should('be.visible');
                cy.get('#modal-title').should('have.text', 'Class Created');
                cy.get('#success-modal').within(() => {
                    cy.get('button').contains('OK').click();
                });
            }
        });
    });

    beforeEach(() => {
        // Visit the create class page for each test
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

        // Check that the validation error modal pops up
        cy.get('#success-modal').should('be.visible');
        cy.get('#modal-title').should('have.text', 'Validation Error');  // Ensures this is the validation modal
        cy.get('#modal-message').should('contain', 'Class Name already exists');

        // Close the validation error modal
        cy.get('#success-modal').within(() => {
            cy.get('button').contains('OK').click();
        });
    });
});
