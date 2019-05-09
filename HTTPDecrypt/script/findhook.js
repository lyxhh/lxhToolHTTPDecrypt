var findhook_retval = null;
var findhook_sendback = {};


setTimeout(function() {
    Java.perform(function() {
        console.log("In ..");
        {{scripts}}
    });
}, 0);