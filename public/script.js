// Store class information globally
let classes = {};

// Fetch classes from the backend on page load
function loadClassesFromBackend() {
    fetch('/classes')
        .then(response => response.json())
        .then(data => {
            classes = {};
            const classDropdown = document.getElementById('class-select');
            classDropdown.innerHTML = '<option value="">Choose a class</option>';

            // Populate the dropdown with classes from the backend
            data.forEach(classItem => {
                classes[classItem.name.toLowerCase()] = {
                    startDate: classItem.startDate,
                    endDate: classItem.endDate,
                    capacity: classItem.capacity
                };
                addClassToDropdown(classItem.name, classItem.startDate, classItem.endDate);
            });
        })
        .catch(error => console.error('Error loading classes:', error));
}

// Debounce function to limit frequent triggering
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Validation function to show a modal with a custom message
function showValidationModal(message) {
    document.getElementById('modal-title').innerText = "Validation Error";
    document.getElementById('modal-message').innerHTML = `<p>${message}</p>`;
    const modal = new bootstrap.Modal(document.getElementById('success-modal'), { backdrop: false });
    modal.show();
}

// Initialize Flatpickr for date fields in Create Class section
flatpickr("#start-date", {
    dateFormat: "Y-m-d",
    onChange: function(selectedDates, dateStr) {
        flatpickr("#end-date", {
            dateFormat: "Y-m-d"
        });
    }
});
flatpickr("#end-date", { dateFormat: "Y-m-d" }); // Fully selectable

// Function to add a class to the dropdown
function addClassToDropdown(name, startDate, endDate) {
    const classDropdown = document.getElementById('class-select');
    const option = document.createElement('option');
    option.value = name;
    option.innerText = name;
    classDropdown.appendChild(option);
}

// Event listener for creating a new class with all validations
document.getElementById('create-class-form').onsubmit = debounce(function(event) {
    event.preventDefault();
    const createButton = event.target.querySelector("button[type='submit']");
    createButton.disabled = true; // Temporarily disable the button

    const name = document.getElementById('class-name').value.trim();
    const normalizedClassName = name.toLowerCase();
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const capacity = parseInt(document.getElementById('capacity').value);
    const today = new Date().toISOString().split("T")[0];

    // Validate capacity
    if (capacity <= 0 || isNaN(capacity)) {
        showValidationModal("Capacity must be greater than 0.");
        createButton.disabled = false;
        return;
    }

    // Validate class name for special characters
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
        showValidationModal("Please enter a valid Class Name (only letters and spaces allowed).");
        createButton.disabled = false;
        return;
    }

    // Check if class name already exists (case-insensitive)
    if (classes[normalizedClassName]) {
        showValidationModal("Class Name already exists.");
        createButton.disabled = false;
        return;
    }

    // Validate start date against today’s date
    if (startDate < today) {
        showValidationModal("The start date should be either today or a future day, not a past day.");
        createButton.disabled = false;
        return;
    }

    // Validate end date against start date
    if (endDate < startDate) {
        showValidationModal("Invalid Date - End date must be the same as or after the start date.");
        createButton.disabled = false;
        return;
    }

    // Send data to server for creating a new class
    fetch('/classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: `name=${name}&startDate=${startDate}&endDate=${endDate}&capacity=${capacity}`
    })
    .then(response => response.text())
    .then(data => {
        showModal("Class Created", "Class created successfully!", {
            type: "class",
            className: name,
            startDate: startDate,
            endDate: endDate,
            capacity: capacity
        });

        addClassToDropdown(name, startDate, endDate);
        loadClassesFromBackend(); // Reload classes to update the list
        document.getElementById('create-class-form').reset();
    })
    .finally(() => {
        createButton.disabled = false; // Re-enable the button after process completes
    });
}, 1000); // Set debounce delay to 1 second

// Load classes from the backend on page load
document.addEventListener('DOMContentLoaded', loadClassesFromBackend);

// Event listener for updating booking date constraints based on selected class
document.getElementById('class-select').onchange = function() {
    const selectedClass = document.getElementById('class-select').value;
    configureBookingDatePicker(selectedClass);
};

// Function to configure the booking date picker with selectable and highlighted dates
function configureBookingDatePicker(selectedClass) {
    if (selectedClass && classes[selectedClass.toLowerCase()]) {
        const { startDate, endDate } = classes[selectedClass.toLowerCase()];

        // Generate all dates between startDate and endDate
        const availableDates = getAllDatesInRange(startDate, endDate);

        flatpickr("#date-picker", {
            dateFormat: "Y-m-d",
            minDate: startDate,
            maxDate: endDate,
            allowInput: true,
            onDayCreate: function(dObj, dStr, fp, dayElem) {
                const formattedDate = formatDate(dayElem.dateObj);

                if (availableDates.includes(formattedDate)) {
                    dayElem.classList.add("highlight-date");
                    dayElem.style.backgroundColor = "#87ceeb";
                    dayElem.style.fontWeight = "bold";
                }
            }
        });
    }
}

// Helper function to format dates as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper function to generate all dates between two dates
function getAllDatesInRange(start, end) {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
        dates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dates;
}

// Helper function to format dates as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// Event listener for booking a class with validations
document.getElementById('booking-form').onsubmit = function(event) {
    event.preventDefault();
    const memberName = document.getElementById('member-name').value.trim();
    const bookingDate = document.getElementById('date-picker').value;
    const className = document.getElementById('class-select').value;

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(memberName)) {
        showValidationModal("Please enter a valid Name (only letters and spaces allowed).");
        return;
    }

    if (!className) {
        showValidationModal("Please select a class to book.");
        return;
    }

    if (!bookingDate) {
        showValidationModal("Please select a booking date.");
        return;
    }

    // Send booking data to the server
    fetch('/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `memberName=${memberName}&date=${bookingDate}&className=${className}`
    })
    .then(response => response.text())
    .then(data => {
        showModal("Booking Successful", data, {
            type: "booking",
            memberName: memberName,
            date: bookingDate,
            className: className
        });

        document.getElementById('booking-form').reset();
        document.getElementById('date-picker')._flatpickr.clear();
    });
};

// Function to show modal with formatted details in a table
function showModal(title, message, details = {}) {
    document.getElementById('modal-title').innerText = title;
    let tableContent = "<table class='table table-bordered'><tbody>";
    if (details.type === "class") {
        tableContent += `
            <tr><td><strong>Class Name</strong></td><td>${details.className}</td></tr>
            <tr><td><strong>Start Date</strong></td><td>${details.startDate}</td></tr>
            <tr><td><strong>End Date</strong></td><td>${details.endDate}</td></tr>
            <tr><td><strong>Capacity</strong></td><td>${details.capacity}</td></tr>
        `;
    } else if (details.type === "booking") {
        tableContent += `
            <tr><td><strong>Name</strong></td><td>${details.memberName}</td></tr>
            <tr><td><strong>Date</strong></td><td>${details.date}</td></tr>
            <tr><td><strong>Class</strong></td><td>${details.className}</td></tr>
        `;
    }
    tableContent += "</tbody></table>";

    document.getElementById('modal-message').innerHTML = tableContent;
    const modal = new bootstrap.Modal(document.getElementById('success-modal'), { backdrop: false });
    modal.show();
}
