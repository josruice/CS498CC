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
    <title>CS498 - Chat</title>
    <script src="jquery/jquery-2.0.3.min.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <script type=text/javascript src="main.js"></script>
    <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="main.css">
</head>

<body>
    <div id="chat-box">
        <div id="navbar" class="modal-header">Messenger</div>
        <div id="text-well">
            <p> text</p>
            <p> text2</p>
            <p> text3</p>
        </div>
        <form action="" id="messageform">
            <div class="input-group">
                <span class="input-group-addon" id="costform">$0.00</span>
                <input type="text" class="form-control" id="textform">
                <div class="input-group-btn">
                    <button type="submit" class="btn btn-default">Submit</button>
                </div>
            </div>
        </form>
    </div>
</body>

</html>
