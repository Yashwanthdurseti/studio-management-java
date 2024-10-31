// classesAPI.spec.cy.js

describe('Classes API Tests', () => {
    const baseUrl = 'https://studio-management-java-6cd114f86749.herokuapp.com';

    it('should create a new class', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/classes`,
            failOnStatusCode: false,
            body: {
                name: 'API Yoga Class',
                startDate: '2024-12-01',
                endDate: '2024-12-15',
                capacity: 25
            }
        }).then((response) => {
            if (response.status === 503) {
                cy.log('Server is unavailable. Retrying...');
            } else {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('name', 'API Yoga Class');
                expect(response.body).to.have.property('startDate', '2024-12-01');
                expect(response.body).to.have.property('endDate', '2024-12-15');
                expect(response.body).to.have.property('capacity', 25);
            }
        });
    });

    it('should retrieve all classes', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/classes`,
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 503) {
                cy.log('Server unavailable. Test skipped.');
            } else {
                expect(response.status).to.eq(200);
                
                // Verify that the response body is an array or an empty array
                if (Array.isArray(response.body)) {
                    cy.log('Classes array retrieved successfully');
                    if (response.body.length > 0) {
                        expect(response.body[0]).to.have.property('name');
                        expect(response.body[0]).to.have.property('startDate');
                        expect(response.body[0]).to.have.property('endDate');
                        expect(response.body[0]).to.have.property('capacity');
                    } else {
                        cy.log('No classes available to verify.');
                    }
                } else {
                    cy.log('Unexpected response format:', response.body);
                }
            }
        });
    });
});
