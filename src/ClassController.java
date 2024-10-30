import java.util.ArrayList;
import java.util.List;

public class ClassController {
    private List<ClassInfo> classes = new ArrayList<>(); // List to store created classes

    // Method to create a class
    public String createClass(String name, String startDate, String endDate, int capacity) {
        ClassInfo newClass = new ClassInfo(name, startDate, endDate, capacity); // Create a new class
        classes.add(newClass); // Add the class to the list
        return "Class created: " + name; // Return confirmation message
    }

    // Method to get all classes (if you need to display them)
    public List<ClassInfo> getAllClasses() {
        return classes; // Return the list of classes
    }
}
