<%@ page import="ChatServer.Chat" %>
<%--
  Created by IntelliJ IDEA.
  User: Josevi
  Date: 2/21/14
  Time: 4:19 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Testing</title>
  </head>
  <body>
    <h3 class="message"><%=Chat.getMessage()%></h3>
    <form action="jspAction" method="get">
        <input type="submit" value="Submit" />
    </form>
  </body>
</html>
