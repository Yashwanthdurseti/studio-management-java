document.addEventListener('DOMContentLoaded', function () {
    loadClasses();
    loadBookings();

    // Event listener for the class dropdown to trigger date filtering
    document.getElementById('class-filter').onchange = updateDateFilter;
});

// Load classes and populate the accordion and class filter
function loadClasses() {
    fetch('/classes')
    .then(response => response.json())
    .then(data => {
        const classesContainer = document.getElementById('classes-container');
        const classFilter = document.getElementById('class-filter');
        
        // Clear existing content to prevent duplicates
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

// Load bookings and populate the bookings table
function loadBookings() {
    fetch('/bookings')
    .then(response => response.json())
    .then(data => {
        const bookingsTableBody = document.getElementById('bookings-table-body');
        bookingsTableBody.innerHTML = ''; // Clear existing rows

        data.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.memberName || "Unknown Member"}</td>
                <td>${booking.className || "Unknown Class"}</td>
                <td>${booking.date || "No Date"}</td>
            `;
            bookingsTableBody.appendChild(row);
        });

        // Store the bookings data globally for easy filtering
        window.bookingsData = data;
    })
    .catch(error => console.error('Error loading bookings:', error));
}

// Function to update the date dropdown based on selected class
function updateDateFilter() {
    const selectedClass = document.getElementById('class-filter').value;
    const dateFilter = document.getElementById('date-filter');

    // Clear the date filter options
    dateFilter.innerHTML = '<option value="">All Dates</option>';

    if (selectedClass === '') {
        // If no class is selected, show no specific dates
        return;
    }

    // Filter bookings to get dates only for the selected class
    const filteredDates = [...new Set(window.bookingsData
        .filter(booking => booking.className === selectedClass)
        .map(booking => booking.date)
    )];

    // Populate the date dropdown with the filtered dates
    filteredDates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.text = date;
        dateFilter.appendChild(option);
    });
}

// Event listener for date dropdown
document.getElementById('date-filter').onchange = filterBookings;

// Filter bookings based on selected class and date
function filterBookings() {
    const selectedClass = document.getElementById('class-filter').value;
    const selectedDate = document.getElementById('date-filter').value;
    const bookingsTableBody = document.getElementById('bookings-table-body');

    // Clear existing rows in the table
    bookingsTableBody.innerHTML = '';

    // Filter bookings based on selected class and date
    const filteredBookings = window.bookingsData.filter(booking => {
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
}
