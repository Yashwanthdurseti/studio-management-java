describe('Bookings API - GET Request', () => {
    const baseUrl = 'https://studio-management-java-6cd114f86749.herokuapp.com';

    it('should retrieve all bookings', () => {
        cy.request('GET', `${baseUrl}/bookings`).then((response) => {
            // Parse the response body as JSON in case it's returned as a string
            const responseBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

            // Verify that the response status code is 200 (OK)
            expect(response.status).to.eq(200);

            // Check if the parsed response body is an array
            expect(responseBody).to.be.an('array');

            // Optionally, if there are bookings, verify the structure of each booking object
            if (responseBody.length > 0) {
                expect(responseBody[0]).to.have.property('memberName');
                expect(responseBody[0]).to.have.property('date');
                expect(responseBody[0]).to.have.property('className');
            }
        });
    });
});
