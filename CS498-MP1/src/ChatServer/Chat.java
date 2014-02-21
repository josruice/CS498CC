package ChatServer;

import com.sun.net.httpserver.HttpServer;
import javax.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Josevi on 2/21/14.
 */
public class Chat extends HttpServlet {
    public static String getMessage(){
        return "Pene";
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
