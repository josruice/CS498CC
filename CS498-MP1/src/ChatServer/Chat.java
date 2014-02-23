package ChatServer;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

import com.google.gson.*;

/**
 * Created by Jose on 2/21/14.
 */
public class Chat extends HttpServlet {

    // Class constants.
    public final double CHAR_COST = 0.1;

    // Class attributes.
    private int lastMessageIndex;
    private HashMap<String,Integer> history;
    private HashMap<String, Double> charges;
    private ArrayList<Message> messages;

    // Method executed at the beginning of the servlet lifecycle.
    @Override
    public void init(ServletConfig config) throws ServletException {
        lastMessageIndex = -1;
        history = new HashMap<String, Integer>();
        charges = new HashMap<String, Double>();
        messages = new ArrayList<Message>();
    }

    public static String getMessage(){
        return "Test message";
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        for(Cookie c : request.getCookies()){
            //TODO: separate Load Balancer cookie from the rest.
            String cookieKey = hashCookie(c);
            if(history.containsKey(cookieKey)){
                // Cookie already in the map. Check last received message.
                Integer lastReceived = history.get(cookieKey);

                // Check if there are messages not received yet.
                if(lastReceived < lastMessageIndex){
                    // Get those messages (last element is not included).
                    Collection<Message> notRcvMsgs = messages.subList(lastReceived+1, messages.size());

                    // Serialize with Gson.
                    Gson gson = new Gson();
                    String msgs = gson.toJson(notRcvMsgs);

                    // Add them to the response message.
                    PrintWriter pw = response.getWriter();
                    pw.print(msgs);
                    pw.flush();

                    // Update the last message received.
                    history.put(cookieKey, lastMessageIndex);

                    // Is it required to send again the cookie?
                    //response.addCookie(c);
                }
            }
            else {
                // Cookie not in the map. New user.
                history.put(cookieKey, lastMessageIndex);
                charges.put(cookieKey, 0.0);
            }
        }
        // Send ok (200) response.
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Extract the request content (JSON object) and build a string with it.
        StringBuffer sb = new StringBuffer();
        BufferedReader br = new BufferedReader(request.getReader());
        String aux = br.readLine();
        while(aux != null){
            sb.append(aux);
            aux = br.readLine();
        }
        String jsonString = sb.toString();

        // Build a Message object using the magic of Gson (thanks Google).
        Gson gson = new Gson();
        Message newMsg = gson.fromJson(jsonString, Message.class);

        // Update the charges applied to this client.
        for(Cookie c : request.getCookies()){
            //TODO: separate Load Balancer cookie from the rest.
            double prevCharge = 0.0;
            String cookieKey = hashCookie(c);
            if(!history.containsKey(cookieKey)){
                // Cookie not in the map. New user.
                history.put(cookieKey, lastMessageIndex);
            }
            else {
                // Cookie already in the map. Add the message cost.
                prevCharge = charges.get(cookieKey);
            }
            double newCharge = prevCharge + (newMsg.getContentLength() * CHAR_COST);
            System.out.println(newCharge);
            charges.put(cookieKey, newCharge);
        }

        // Add the object to the Message list and update the counter.
        messages.add(newMsg);
        lastMessageIndex++;

        // Send an OK (200) response (we are good boys).
        response.setStatus(HttpServletResponse.SC_OK);
    }

    // Method executed at the end of the servlet lifecycle.
    @Override
    public void destroy(){

    }

    // Method to build a String key with the cookie information (hash method of Cookie class does not work as expected).
    private String hashCookie(Cookie c){
        StringBuffer cookieBuffer = new StringBuffer();

        cookieBuffer.append(c.getName());
        cookieBuffer.append(c.getValue());
        cookieBuffer.append(c.getDomain());
        cookieBuffer.append(c.getComment());

        return cookieBuffer.toString();
    }
}