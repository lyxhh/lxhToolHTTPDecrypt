var finds_index = null;
var finds_pkgname = null;
var finds_classname = null;
var finds_methodname = null;
var finds_hook = null;
var finds_methods = null;
var finds_Fields = null;
var finds_Modifier = null;
var finds_Accesspermissions = null;
var finds_cell = null;

function enumtrace(pattern){
    // var className = null;
    Java.enumerateLoadedClasses({
			onMatch: function(aClass) {
				if (aClass.match(pattern) {{ options }} ) {
					// console.log(aClass);
				 	send("finds class "+ aClass +" all method" + "-se00nood00tooag-");
					traceClass(aClass);
				}
			},
			onComplete: function() {
			  	send("findclass enum done..." + "-se00nood00tooag-");
			}
		});
}

function traceClass(targetClass)
{

    try {
		finds_hook = Java.use(targetClass);
	 	finds_methods = finds_hook.class.getDeclaredMethods();
		finds_Fields = finds_hook.class.getDeclaredFields();
		finds_Modifier = Java.use("java.lang.reflect.Modifier");
		finds_Accesspermissions = finds_Modifier.toString(finds_hook.class.getModifiers());
		// console.log(finds_Accesspermissions);
		finds_hook.$dispose;
		// var parsedMethods = [];
		// finds_Fields.forEach(function(Field) {
		// 	console.log(Field);
		// });
		finds_methods.forEach(function(method) {

			finds_index = targetClass.lastIndexOf('.');
			finds_pkgname = targetClass.substr(0,finds_index);
			finds_classname = targetClass.substr(finds_index + 1);
			finds_methodname = method.toString().replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)/)[1];

			finds_cell = { "pkgname": finds_pkgname, "fullclassname":targetClass, "classname": finds_classname, "methodname": finds_methodname, "methodinfo": method.toString(),"Accesspermissions":finds_Accesspermissions};
			// sendback = JSON.stringify(finds_cell) + "-fO0ioon00ds-";
			// console.log(sendback);
			send(JSON.stringify(finds_cell) + "-fO0ioon00ds-");
		});
	}catch (err) {}
}

setImmediate(function() {
    Java.perform(function() {
    	send("finds running..." + "-se00nood00tooag-");

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
});