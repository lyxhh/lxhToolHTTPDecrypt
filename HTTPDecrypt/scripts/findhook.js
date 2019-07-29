var findhook_retval = null;
var findhook_sendback = {};
var findhook_returntype = null;

setImmediate(function() {
    Java.perform(function() {
        send("findhooks running..." + "-se00nood00tooag-");
        {{scripts}}
    });
});