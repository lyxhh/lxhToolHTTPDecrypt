var line = '-lioonooe-';
var index = null;
var pkgname = null;
var classname = null;
var methodname = null;
var hook = null;
var methods = null;
var Fields = null;
var Modifier = null;
var Accesspermissions = null;

function enumtrace(pattern){
    // var className = null;
    Java.enumerateLoadedClasses({
			onMatch: function(aClass) {
				// console.log("aclass: "+aClass);
				if (aClass.match(pattern) {{ options }} ) {
					traceClass(aClass);
				}
			},
			onComplete: function() {}
		});
}

function traceClass(targetClass)
{

    try {
		hook = Java.use(targetClass);
	 	methods = hook.class.getDeclaredMethods();
		Fields = hook.class.getDeclaredFields();
		Modifier = Java.use("java.lang.reflect.Modifier");
		Accesspermissions = Modifier.toString(hook.class.getModifiers());
		// console.log(Accesspermissions);
		hook.$dispose;
		// var parsedMethods = [];
		// Fields.forEach(function(Field) {
		// 	console.log(Field);
		// });
		methods.forEach(function(method) {

			index = targetClass.lastIndexOf('.');
			pkgname = targetClass.substr(0,index);
			classname = targetClass.substr(index + 1);
			methodname = method.toString().replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)/)[1];

			cell = { "pkgname": pkgname, "fullclassname":targetClass, "classname": classname, "methodname": methodname, "methodinfo": method.toString(),"Accesspermissions":Accesspermissions};
			sendback = JSON.stringify(cell) + "-fO0ioon00ds-";
			// console.log(sendback);
			send(sendback);
		});
	}catch (err) {}
}

setTimeout(function() {
    Java.perform(function() {
        // enumerate all classes
		console.log("In ..");

		var x = {{ matchfindtext }};
		var val = ""
		for(var item = 0; item < x.length; item++){
			val = x[item];
			if (0 == item || "" != val ){
				//除第一个为空外，其他为空不执行。
				// console.log(item);
				enumtrace(val);
			}
		}
    });
}, 0);