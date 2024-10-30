public class BookingInfo {
    private String memberName;
    private String date;
    private String className; // Add className field

    // Constructor
    public BookingInfo(String memberName, String date, String className) {
        this.memberName = memberName;
        this.date = date;
        this.className = className;
    }

    // Getters and setters can be added if needed
    public String getClassName() {
        return className;
    }
}
