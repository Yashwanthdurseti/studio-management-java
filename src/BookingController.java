import java.util.ArrayList;
import java.util.List;

public class BookingController {
    private List<BookingInfo> bookings = new ArrayList<>(); // List to store bookings

    // Method to book a class with className
    public String bookClass(String memberName, String date, String className) {
        BookingInfo newBooking = new BookingInfo(memberName, date, className); // Create new booking with class name
        bookings.add(newBooking); // Add booking to the list
        return "Booking created for: " + memberName + " in class " + className; // Return confirmation message
    }

    // Method to get all bookings (for displaying in the bookings page)
    public List<BookingInfo> getAllBookings() {
        return bookings; // Return the list of bookings
    }
}
