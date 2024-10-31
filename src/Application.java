import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import com.google.gson.Gson;
import java.util.List;

public class Application {
    public static void main(String[] args) throws IOException {

        // Get the port number from the environment variable or use 8000 as a fallback for local testing
    String portEnv = System.getenv("PORT");
    int port = (portEnv != null) ? Integer.parseInt(portEnv) : 8000;
    HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
       // HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        server.createContext("/classes", new ClassHandler());
        server.createContext("/bookings", new BookingHandler());
        server.createContext("/", new StaticFileHandler()); // Serve static files from root
        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("Server is running on port " + port);
        System.out.println("Current Working Directory: " + new File(".").getAbsolutePath());
    }

    static class ClassHandler implements HttpHandler {
        private ClassController classController = new ClassController(); // Use ClassController

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                InputStream inputStream = exchange.getRequestBody();
                String body = new String(inputStream.readAllBytes());
                String[] params = body.split("&");
                String name = params[0].split("=")[1];
                String startDate = params[1].split("=")[1];
                String endDate = params[2].split("=")[1];
                int capacity = Integer.parseInt(params[3].split("=")[1]);

                String response = classController.createClass(name, startDate, endDate, capacity); // Use controller
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else if ("GET".equals(exchange.getRequestMethod())) {
                Gson gson = new Gson();
                String json = gson.toJson(classController.getAllClasses()); // Retrieve all classes
                exchange.sendResponseHeaders(200, json.length());
                OutputStream os = exchange.getResponseBody();
                os.write(json.getBytes());
                os.close();
            } else {
                String response = "Unsupported HTTP method.";
                exchange.sendResponseHeaders(405, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }

    static class BookingHandler implements HttpHandler {
        private BookingController bookingController = new BookingController(); // Use BookingController
    
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                InputStream inputStream = exchange.getRequestBody();
                String body = new String(inputStream.readAllBytes());
                String[] params = body.split("&");
    
                String memberName = params[0].split("=")[1];
                String date = params[1].split("=")[1];
                String className = params[2].split("=")[1]; // Extract className from parameters
    
                String response = bookingController.bookClass(memberName, date, className); // Use className in booking
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else if ("GET".equals(exchange.getRequestMethod())) {
                Gson gson = new Gson();
                String json = gson.toJson(bookingController.getAllBookings()); // Retrieve all bookings
                exchange.sendResponseHeaders(200, json.length());
                OutputStream os = exchange.getResponseBody();
                os.write(json.getBytes());
                os.close();
            } else {
                String response = "Unsupported HTTP method.";
                exchange.sendResponseHeaders(405, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }
    

   

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String uri = exchange.getRequestURI().toString();

            String filePath;
            if (uri.equals("/")) {
                filePath = "public/index.html";
            } else {
                filePath = "public" + uri;
            }
           // String filePath = "./public" + uri; // Adjust path to point to public folder

            System.out.println("Requested URI: " + uri);
            System.out.println("File path: " + filePath);

            File file = new File(filePath);
            if (file.exists() && !file.isDirectory()) {
                System.out.println("File found: " + filePath);
                exchange.sendResponseHeaders(200, file.length());
                try (InputStream is = new FileInputStream(file);
                     OutputStream os = exchange.getResponseBody()) {
                    byte[] buffer = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = is.read(buffer)) != -1) {
                        os.write(buffer, 0, bytesRead);
                    }
                }
            } else {
                String response = "404 Not Found";
                System.out.println("File not found: " + filePath);
                exchange.sendResponseHeaders(404, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }
}
