function findobjcmethods(searchstring) {
	var resolver = new ApiResolver("objc");

	send("Search for matching methods based on " + searchstring + "-se00nood00tooag-");
	resolver.enumerateMatches("*[* *" + searchstring + "*]", {
		onMatch: function (target) {
			var results = {}
			var targetClassMethod = target['name'];
			results["fullclassName"] = targetClassMethod;
			results["className"] = targetClassMethod.match(/^[-+]\[(.*)\s/)[1];
			results["methodType"] = targetClassMethod.match(/^([-+])/)[1];	
			results["methodName"] = targetClassMethod.match(/^[-+]\[.*\s(.*)\]/)[1];
			results["argCount"] = (results["methodName"].match(/:/g) || []).length;
			send(JSON.stringify(results) + "-iooos00fi0nd0cla0ssm0et0hod-");
			// results[match['name']] = match['address'];
		},
		onComplete: function () {
			send("Search for matching methods based on " + searchstring + " enum done..." + "-se00nood00tooag-");
		}
	});
}

function findjavamethods(searchstring){
    Java.perform(function() {
    	Java.enumerateLoadedClasses({
			onMatch: function(className) {
				if (className.match("") {{ options }} ){
					send(className + "-se00nood00tooag-");
					enumJavaClassMethod(className, searchstring);
				}
			},
			onComplete: function() {

			  	send("AllClass enum done..." + "-se00nood00tooag-");
			}
		});
    });
}

function enumJavaClassMethod(targetClass,searchstring){
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

    try {
		finds_hook = Java.use(targetClass);
	 	finds_methods = finds_hook.class.getDeclaredMethods();
		// finds_Fields = finds_hook.class.getDeclaredFields();
		finds_Modifier = Java.use("java.lang.reflect.Modifier");
		finds_Accesspermissions = finds_Modifier.toString(finds_hook.class.getModifiers());
		// console.log(finds_Accesspermissions);
		finds_hook.$dispose;
		// var parsedMethods = [];
		// finds_Fields.forEach(function(Field) {
		// 	console.log(Field);
		// });
		finds_methods.forEach(function(method) {
			// console.log(method);
			finds_index = targetClass.lastIndexOf('.');
			finds_pkgname = targetClass.substr(0, finds_index);
			finds_classname = targetClass.substr(finds_index + 1);
			finds_methodname = method.toString().replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)/)[1];
			if (finds_methodname.match(searchstring)) {
				finds_cell = {
					"pkgname": finds_pkgname,
					"fullclassname": targetClass,
					"classname": finds_classname,
					"methodname": finds_methodname,
					"methodinfo": method.toString(),
					"Accesspermissions": finds_Accesspermissions
				};
				// sendback = JSON.stringify(finds_cell) + "-fO0ioon00ds-";
				// console.log(sendback);
				send(JSON.stringify(finds_cell) + "-fO0ioon00ds-");
			}
		});
	}catch (err) {}
}

function main(val){
	if (ObjC.available) {
		findobjcmethods(val);
	}else if(Java.available) {
		findjavamethods(val);
		// findjavamethods(val);
	}
}

setImmediate(function() {

	send("Searchmethods running..." + "-se00nood00tooag-");
	var x = {{ find_list }};
	var val = "";
	for(var item = 0; item < x.length; item++){
		val = x[item];
		if (0 == item || "" != val ){
			//除第一个为空外，其他为空不执行。
			// console.log(item);
			send("Search for matching methods based on " +val + "-se00nood00tooag-");
			main(val);
		}
		send("Search for matching methods based on " +val +" enum done..." + "-se00nood00tooag-");
	}
});