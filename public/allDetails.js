document.addEventListener('DOMContentLoaded', function () {
    loadClasses();
    loadBookings();
    
    // Event listeners for dropdowns to trigger filtering
    document.getElementById('class-filter').onchange = updateDateFilter;
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
            option.dataset.startDate = classInfo.startDate; // Store start date
            option.dataset.endDate = classInfo.endDate; // Store end date
            classFilter.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading classes:', error));
}

// Function to update the date filter based on the selected class
function updateDateFilter() {
    const selectedClassOption = document.getElementById('class-filter').selectedOptions[0];
    const dateFilter = document.getElementById('date-filter');
    
    // Clear the date filter dropdown
    dateFilter.innerHTML = '<option value="">All Dates</option>';
    
    if (selectedClassOption.value) {
        // Get the start and end dates for the selected class
        const startDate = new Date(selectedClassOption.dataset.startDate);
        const endDate = new Date(selectedClassOption.dataset.endDate);
        
        // Populate the date filter dropdown with dates between start and end dates
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateOption = document.createElement('option');
            dateOption.value = currentDate.toISOString().split('T')[0];
            dateOption.text = currentDate.toISOString().split('T')[0];
            dateFilter.appendChild(dateOption);

            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    
    // After setting date options, filter bookings with the selected class and new date range
    filterBookings();
}

// Load all bookings and populate the bookings table
function loadBookings() {
    fetch('/bookings')
    .then(response => response.json())
    .then(data => {
        populateBookingsTable(data);
    })
    .catch(error => console.error('Error loading bookings:', error));
}

// Populate bookings table with data
function populateBookingsTable(data) {
    const bookingsTableBody = document.getElementById('bookings-table-body');
    bookingsTableBody.innerHTML = ''; // Clear any existing table rows

    data.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.memberName || "Unknown Member"}</td>
            <td>${booking.className || "Unknown Class"}</td>
            <td>${booking.date || "No Date"}</td>
        `;
        bookingsTableBody.appendChild(row);
    });
}

// Filter bookings based on selected class and date
function filterBookings() {
    const selectedClass = document.getElementById('class-filter').value;
    const selectedDate = document.getElementById('date-filter').value;

    fetch('/bookings')
    .then(response => response.json())
    .then(data => {
        const filteredBookings = data.filter(booking => {
            const matchClass = selectedClass === '' || booking.className === selectedClass;
            const matchDate = selectedDate === '' || booking.date === selectedDate;
            return matchClass && matchDate;
        });

        // Populate table with filtered bookings
        populateBookingsTable(filteredBookings);
    })
    .catch(error => console.error('Error filtering bookings:', error));
}
