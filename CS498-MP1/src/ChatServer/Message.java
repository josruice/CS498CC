package ChatServer;

/**
 * Created by Josevi on 2/23/14.
 */
public class Message {
    private String author;
    private String content;

    public Message(String author, String content){
        this.author = author;
        this.content = content;
    }

    public int getContentLength(){
        return this.content.length();
    }
}