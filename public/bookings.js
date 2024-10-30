window.onload = function() {
    fetch('/bookings') // Fetch all bookings
    .then(response => {
        console.log("Response status:", response.status); // Log the response status
        return response.json();
    })
    .then(data => {
        console.log("Fetched bookings:", data); // Log the fetched data
        const tableBody = document.getElementById('bookingsTable').getElementsByTagName('tbody')[0];
        data.forEach(booking => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = booking.memberName; // Member name
            row.insertCell(1).innerText = booking.date;      // Booking date
        });
    })
    .catch(error => {
        console.error('Error fetching bookings:', error);
    });
};
