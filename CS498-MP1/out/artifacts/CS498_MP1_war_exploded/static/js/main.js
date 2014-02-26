var LOAD_BALANCER_IP = "http://localhost:8080/Chat/chat";
//var LOAD_BALANCER_IP = "http://Team40LoadBalancer-899630239.us-east-1.elb.amazonaws.com:8080/Chat/chat";
var GENERATE_MODE = false;

var session_cost = 0;
var count = 0;
var name = "default_name";

var textBox;
var costForm;
var textForm;

var generateInterval;
var refreshInterval;

$(document).ready(function(){
    textBox = $('#text-well');
    textBox.attr("scrollHeight");

    costForm = $('#costform');
    textForm = $('#textform');

    name = prompt("Please enter your name", name);

    $.("#exit").click(function(){
       console.log("clicked");
    });

    window.onunload = window.onbeforeunload = (function(){

        var didMyThingYet=false;

        return function(){
            if (didMyThingYet) return;
            didMyThingYet=true;
            alert("wtf");
            var r = confirm("You are exiting the page. Would you like to notify the other chat-room guests that you're exiting?");
            if (r == true) {
                send_message(name + " is exiting the chatroom.");
            }
        }

    }());

    handle_message_submit($('#messageform'));
    if(GENERATE_MODE)
        generateInterval = setInterval(function(){generate_messages();}, 5000);

    refreshInterval = setInterval(function(){get_messages();}, 5000);
});


function get_messages() {
    console.log("Getting Messages");
    $.ajax({
        type: "GET",
        url: LOAD_BALANCER_IP,
        success: function (data) {
            console.log(data);
            console.log("success");
            if(data.length != 0){
                console.log(data);
                var messages = $.parseJSON(data);
                for(var i =0; i < messages.length; i++) {
                    append_message(messages[i].author,messages[i].content);
                }
            }
        },
        error: function(e) {
            console.log(e.status);
            if(e.status == 200){
                console.log(e.responseText);
            }
            else {
                alert("Get Unsuccessful");
                console.log(e);
            }
        }
    });
}

function append_message(author, message) {
    textBox.append("<p>"+author+": " + message + "</p></br>");
    textBox.scrollTop(textBox[0].scrollHeight);
}

function handle_message_submit(form) {
    form.submit(function(e) {
        e.preventDefault();
        console.log("Sending Message: " + textForm.val());
        send_message(textForm.val());
        return false;
    });
}

function send_message(text) {
    $.ajax({
        type: "POST",
        url: LOAD_BALANCER_IP,
        dataType: 'json',
        data: JSON.stringify({
            author: name,
            content: text.toString()
        }),
        success: function (data) {
            add_cost(text.length);
            textForm.val("");
        },
        error: function(e) {
            if(e.status == 200){
                console.log("Send Successful");
                add_cost(text.length);
            }
            else {
                alert("Send Unsuccessful");
                console.log(e);
            }
            textForm.val("");
        }
    });
}

function add_cost(length) {
    session_cost += length * 10;
    var cost_string = "$" + session_cost.toString();
    var string_length = cost_string.length - 2;
    cost_string = cost_string.slice(0, string_length) + "." + cost_string.slice(string_length)
    costForm.html(cost_string);
}

function generate_messages() {
    console.log("Generating Messages");
    for(var i = 0; i < 100 ; i ++) {
        append_message("author", "Test"+count++);
        add_cost(10);
    }
}