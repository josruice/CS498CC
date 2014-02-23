var LOAD_BALANCER_IP = "127.0.0.1";
var COOOKIE_NAME = "my-cookie";
var GENERATE_MODE = false;

var session_cost = 0;
var count = 0;

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

    handle_message_submit($('#messageform'));
    if(GENERATE_MODE)
        generateInterval = setInterval(function(){generate_messages();}, 5000);

    refreshInterval = setInterval(function(){get_messages();}, 5000);
});


function get_messages() {
    console.log("Getting Messages");
    $.ajax({
        type: "GET",
        //	url: LOAD_BALANCER_IP,
        crossDomain: true,
        dataType: 'json',
        success: function (data) {
            var messages = $.parseJSON(data);
            for (i=0; i<this.messages; i++) {
                append_message("other", messages[i]);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Get Unsuccessful");
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
        //	url: LOAD_BALANCER_IP,
        crossDomain: true,
        dataType: 'json',
        data: {message: text},
        success: function (data) {
            add_cost(text.length);
            textForm.html("");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            textForm.val("");
            alert("Send Unsuccessful");
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