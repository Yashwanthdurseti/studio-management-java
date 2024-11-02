                                      Studio Management Application

A web application to manage studio classes, bookings, and user interactions, built with a Java backend and JavaScript frontend. The project allows users to create fitness classes, book available sessions, and view all class details.

Live Application link : https://studio-management-java-6cd114f86749.herokuapp.com/

**CI/CD Integration:**
This project includes a CI/CD pipeline configured with GitHub Actions, automating the build, testing, and deployment processes. The workflow uses **Gradle** for building the Java backend, **Node.js** setup for the frontend, and **Cypress** for running end-to-end tests. Automated test cases ensure that critical functionalities are validated, including class creation, duplicate validation, and booking flows.

**Features:**

**Create and Manage Classes:** Admins can create classes with specific names, capacities, start and end dates.

**Class Booking System:** Users can book classes based on availability and view their bookings.

**Data Validations:** Validations ensure proper class creation (capacity, dates, and uniqueness) and bookings.

**API Endpoints:** Supports GET and POST requests for /classes and /bookings.

**Technologies Used:**

**Frontend:** HTML, CSS, JavaScript, Flatpickr for date selection, and Bootstrap for UI styling.
**Backend:** Java using the Java HTTP Server.
**Testing:** Cypress for end-to-end and API testing.
**Deployment:** Hosted on Heroku.


**Setup and Installation**

**1)**Clone the Repository:****
git clone https://github.com/Yashwanthdurseti/studio-management-java.git
cd studio-management-java


**2)**Dependencies:****
Ensure you have Java 17 or later installed.
Install Heroku CLI if deploying.

**3)Run the Application:**
Run the backend server with:
java -cp "lib/*:bin" Application

**4)Testing with Cypress:**
Navigate to the cypress folder and run tests:
npx cypress open



**API Documentation**
Create Class: POST /classes
Retrieve Classes: GET /classes
Create Booking: POST /bookings
Retrieve Bookings: GET /bookings

