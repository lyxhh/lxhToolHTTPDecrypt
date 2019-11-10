'use strict';

var rpc_result = null;
var rpc_result_ios = null;
rpc.exports = {
	
	
    taga474d869acf7a96c9649f0ab604c77b101: function(arg0){
        Java.perform(function () {
            try{
				// var context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
                var demo21c9124e009bf5b1cdc6abe9e2873f26 = Java.use("com.frida.lxh.fridademo.demo");
                rpc_result = demo21c9124e009bf5b1cdc6abe9e2873f26.overload(arg0);
                // send(JSON.stringify({"aa":"bb","aa1":"bbb"})+'-cusoto0oom0sc0ri0pt-')
            }catch(e){console.log(e)}
        });
        return rpc_result;
    },
// Added Function 
	
	
}