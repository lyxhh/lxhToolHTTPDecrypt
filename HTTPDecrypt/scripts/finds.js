function main(val){
	if (ObjC.available) {
		enumObjcAllClass(val);
	}else if(Java.available) {
		enumJavaAllClass(val);
	}
}


function enumJavaAllClass(classname){
    // var className = null;
    Java.perform(function() {
    	Java.enumerateLoadedClasses({
			onMatch: function(className) {
				if (className.match(classname) {{ options }} ) {
					// console.log(className);
				 	send("find class "+ className +" all method" + "-se00nood00tooag-");
					// traceClass(className);
					enumJavaClassMethod(className);
				}
			},
			onComplete: function() {
			  	send("findclass enum done..." + "-se00nood00tooag-");
			}
		});
    });
}


function enumObjcAllClass(classname){
    // var className = null;
	for (var className in ObjC.classes) {
		if (ObjC.classes.hasOwnProperty(className) && className.match(classname) {{ options }}) {

		 	send("finds class "+ className +" all method" + "-se00nood00tooag-");
			enumObjcClassMethod(className);

		}
	}
	send("findclass enum done..." + "-se00nood00tooag-");

}


function enumObjcClassMethod(targetClass) {		
	// var method = {}
	// var ownMethods = ObjC.classes[targetClass].$ownMethods; // 不包含父类的公开方法

	// ownMethods.forEach(function(method) {
	// 	console.log(JSON.stringify(method));  //"- getInfo"  //"- sumWith:AndNumber:"

	// });
	var resolver = new ApiResolver("objc");
	resolver.enumerateMatches("*[" + targetClass + " *]", {
		onMatch: function (target) {
			// console.log(JSON.stringify(target)); //{"name":"-[MyClass getInfo]","address":"0x1007f65cc"}
			var results = {};
			var targetClassMethod = target['name'];
			results["fullclassName"] = targetClassMethod;
			results["className"] = targetClassMethod.match(/^[-+]\[(.*)\s/)[1];
			results["methodType"] = targetClassMethod.match(/^([-+])/)[1];	
			results["methodName"] = targetClassMethod.match(/^[-+]\[.*\s(.*)\]/)[1];
			results["argCount"] = (results["methodName"].match(/:/g) || []).length;
			send(JSON.stringify(results) + "-iooos00fi0nd0cla0ssm0et0hod-");
			// console.log(JSON.stringify(results));
			// results[match['name']] = match['address'];
		},
		onComplete: function () {
			send("findObjcClass " + targetClass + " enum done..." + "-se00nood00tooag-");
		}
	});
}


function enumJavaClassMethod(targetClass){
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

	send("finds running..." + "-se00nood00tooag-");
	var x = {{ matchfindtext }};
	var val = "";
	for(var item = 0; item < x.length; item++){
		val = x[item];
		if (0 == item || "" != val ){
			//除第一个为空外，其他为空不执行。
			// console.log(item);
			main(val);
		}
	}
});