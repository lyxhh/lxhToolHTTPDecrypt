'use strict';

var rpc_result = null;
var rpc_result_ios = null;
rpc.exports = {
	
	
    taga474d869acf7a96c9649f0ab604c77b101: function(arg0){
        Java.perform(function () {
            try{
				// var context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
                var demo4498d113161bdf81bc3a8e1268a2cc1e = Java.use("com.frida.lxh.fridademo.demo");
                rpc_result = demo4498d113161bdf81bc3a8e1268a2cc1e.overload(arg0);
            }catch(e){console.log(e)}
        });
        return rpc_result;
    },
// Added Function 
	
	aaaaaa
}