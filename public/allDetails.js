document.addEventListener('DOMContentLoaded', function () {
    loadClasses();
    loadBookings();

    // Event listeners for dropdowns to trigger filtering
    document.getElementById('class-filter').onchange = function() {
        updateDateFilter();
        filterBookings(); // Ensure table updates when class is selected
    };
    document.getElementById('date-filter').onchange = filterBookings;
});

// Load classes and populate the accordion and class filter
function loadClasses() {
    fetch('/classes')
    .then(response => response.json())
    .then(data => {
        const classesContainer = document.getElementById('classes-container');
        const classFilter = document.getElementById('class-filter');
        
        // Clear existing content in container and filter dropdown to prevent duplicates
        classesContainer.innerHTML = '';
        classFilter.innerHTML = '<option value="">All Classes</option>';
        
        data.forEach((classInfo, index) => {
            // Create each class entry as an accordion item
            const classItem = document.createElement('div');
            classItem.classList.add('accordion-item');
            classItem.innerHTML = `
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                        ${classInfo.name}
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#classesAccordion">
                    <div class="accordion-body">
                        <p><strong>Start Date:</strong> ${classInfo.startDate}</p>
                        <p><strong>End Date:</strong> ${classInfo.endDate}</p>
                        <p><strong>Capacity:</strong> ${classInfo.capacity}</p>
                    </div>
                </div>
            `;
            classesContainer.appendChild(classItem);

            // Add class to the filter dropdown
            const option = document.createElement('option');
            option.value = classInfo.name;
            option.text = classInfo.name;
            classFilter.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading classes:', error));
}

// Load bookings and populate the bookings table and date filter dropdown
function loadBookings() {
    fetch('/bookings')
    .then(response => response.json())
    .then(data => {
        const bookingsTableBody = document.getElementById('bookings-table-body');
        
        // Clear any existing table rows
        bookingsTableBody.innerHTML = '';

        // Populate bookings table and gather unique dates for the date filter dropdown
        const uniqueDates = new Set();
        data.forEach(booking => {
            uniqueDates.add(booking.date); // Collect unique dates
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.memberName || "Unknown Member"}</td>
                <td>${booking.className || "Unknown Class"}</td>
                <td>${booking.date || "No Date"}</td>
            `;
            bookingsTableBody.appendChild(row);
        });

        // Populate date filter dropdown
        const dateFilter = document.getElementById('date-filter');
        dateFilter.innerHTML = '<option value="">All Dates</option>'; // Reset date filter options
        uniqueDates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.text = date;
            dateFilter.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading bookings:', error));
}

// Update date filter dropdown based on the selected class
function updateDateFilter() {
    const selectedClass = document.getElementById('class-filter').value;
    const dateFilter = document.getElementById('date-filter');
    dateFilter.innerHTML = '<option value="">All Dates</option>'; // Reset date options

    // Fetch bookings and filter dates for the selected class
    fetch('/bookings')
    .then(response => response.json())
    .then(data => {
        const uniqueDates = new Set();
        data.forEach(booking => {
            if (selectedClass === "" || booking.className === selectedClass) {
                uniqueDates.add(booking.date); // Collect dates for the selected class
            }
        });

        // Populate the date dropdown with filtered dates
        uniqueDates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.text = date;
            dateFilter.appendChild(option);
        });
    })
    .catch(error => console.error('Error updating date filter:', error));
}

// Filter bookings based on selected class and date
function filterBookings() {
    const selectedClass = document.getElementById('class-filter').value;
    const selectedDate = document.getElementById('date-filter').value;
    const bookingsTableBody = document.getElementById('bookings-table-body');

    // Clear existing rows in the table before populating
    bookingsTableBody.innerHTML = '';

    // Fetch bookings and apply filters
    fetch('/bookings')
    .then(response => response.json())
    .then(data => {
        const filteredBookings = data.filter(booking => {
            const matchClass = selectedClass === '' || booking.className === selectedClass;
            const matchDate = selectedDate === '' || booking.date === selectedDate;
            return matchClass && matchDate;
        });

        // Populate table with filtered bookings
        filteredBookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.memberName || "Unknown Member"}</td>
                <td>${booking.className || "Unknown Class"}</td>
                <td>${booking.date || "No Date"}</td>
            `;
            bookingsTableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error filtering bookings:', error));
}
