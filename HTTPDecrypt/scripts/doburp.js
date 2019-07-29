var retval = null;
var sendback = {};
var recv_data = null;
var signature = "-to0obuooO0rp-";
var doburp_clazz_Thread = null;

function getCaller(){
	return doburp_clazz_Thread.currentThread().getStackTrace().slice(2,5).reverse().toString().replace(/,/g,"--->");
}

setImmediate(function() {
    Java.perform(function() {
        send("doburp running..." + "-se00nood00tooag-");
        {{scripts}}
    });
});


