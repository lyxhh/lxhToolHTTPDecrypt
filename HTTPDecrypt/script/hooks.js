var clazz_Thread = null;
var linebreak = "-lineline-";
var line = '-lioonooe-';
var hooks_type = '';
var hooks_args_index = '';
var hooks_retval_dump = '';
var hooks_datatype = '';
var hooks_ret_type = '';
var hooks_retval = "";
var hooks_cell = "";

function getCaller(){
	// return clazz_Thread.currentThread().getStackTrace().reverse().toString().replace(/,/g,linebreak);
	return clazz_Thread.currentThread().getStackTrace().slice(2,5).reverse().toString().replace(/,/g,linebreak);
}


function enumtrace(pattern){
	Java.enumerateLoadedClasses({
			onMatch: function(aClass) {
				if (aClass.match(pattern)) {

					traceClass(aClass);
				}
			},
			onComplete: function() {}
		});
	
}

function uniqBy(arr){
    arr = arr.sort();
    var result = [arr[0]];

    for (var i=1, len=arr.length; i<len; i++) {
        arr[i] !== arr[i-1] && result.push(arr[i])
    }
    return result
}

function traceClass(targetClass)
{
    try {
		var hook = Java.use(targetClass);
		var methods = hook.class.getDeclaredMethods();
		// var Modifier = Java.use("java.lang.reflect.Modifier");
		hook.$dispose;
		var parsedMethods = [];
		methods.forEach(function(method) {

            // if (!Modifier.isAbstract(method.getModifiers())
			// 	&& !Modifier.isNative(method.getModifiers())
			// 	&& !Modifier.isInterface(method.getModifiers())
			// ){
            // 	console.log(method);
			// console.log(method.toString().replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)\(/)[1]);
			parsedMethods.push(method.toString().replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)\(/)[1]);
			// }
		});
	  //去重
		var targets = uniqBy(parsedMethods);
	  //hook all method
		targets.forEach(function(targetMethod) {

			// if(!targetClass.startsWith("android.")
			// 	&& !targetClass.startsWith("org.")
			// 	&& !targetClass.startsWith("java.")
			// 	&& !targetClass.startsWith(".system")
			// 	// && !targetClass.contains("com.huawei")
			// ) {
			// 	console.log("1");

				traceMethod(targetClass, targetMethod);

            // }
		});
	}catch (err) {}
}

function arrayTohex(data) {
    var hexstr = "";
    for (i = 0;i < data.length; i++) {
        var b = (data[i] >>> 0) & 0xff;
        var n = b.toString(16);
        hexstr += ("00" + n).slice(-2)+",";
    }
    //console.log("Output: " + hexstr + " data: "+ data);
    return hexstr;
}


function getDataType(data) {
    if(data === null){
        return 'null';
    } else if(typeof data == 'object'){
        if( typeof data.length == 'number' ){
            return 'Array';
        }else{
            return 'Object';
        }
    }else{
        return 'no object type ';
    }
}

function traceMethod(targetClass,targetMethod){
	// console.log("123");
	var targetClassMethod = targetClass+'.'+ targetMethod;
	var hookClazz = Java.use(targetClass);
	var overloadCount = hookClazz[targetMethod].overloads.length;
	clazz_Thread = Java.use("java.lang.Thread");
	// console.log(targetClass);
	var List_hook  = null;
	for (var i = 0;i < overloadCount;i++){
		List_hook  = eval('hookClazz[targetMethod].overloads[i]');
		List_hook.implementation = function() {
			// 打印参数
			var arg_dump = '';
			var arg_type = '';
			var method_stack = '';


			for (var index = 0; index < arguments.length; index++) {
			// for (var index = 0; index < method_hook.argumentTypes.length; index++) {
				hooks_args_index = arguments[index];
				hooks_type = typeof(hooks_args_index);
                // type = method_hook.argumentTypes[index]["className"];
				hooks_datatype = getDataType(hooks_args_index);

                arg_type += (line + 'argType' + index.toString() + " : " + String(hooks_type));
                // console.log(arg_type);
                if (hooks_datatype == "Array") {
					// hex_arg =  arrayTohex(args_index);
					arg_dump += ("arg" + index.toString() + ": " + JSON.stringify(hooks_args_index) + line );
				}else{
					arg_dump += ("arg" + index.toString() + ": " + String(hooks_args_index) + line  );
				}
			}

			hooks_ret_type = String(List_hook.returnType['className']);
			hooks_retval = this[targetMethod].apply(this, arguments); // rare crash (Frida bug?)

			if (hooks_ret_type == "[B"){
				// new_retval=  arrayTohex(retval);
				hooks_retval_dump = "(" + hooks_ret_type + ') : ' + JSON.stringify(hooks_retval);
			}else{
				hooks_retval_dump = "(" + hooks_ret_type + ') : ' + String(hooks_retval);
			}
			// console.log(datatype +": "+ arg_dump);
			method_stack += getCaller();

			hooks_cell = { "method_stack": method_stack, "arg_type" : arg_type,"arg_dump" : arg_dump, "retval_dump" : hooks_retval_dump,"targetClassMethod" : targetClassMethod};
			// sendback =
			// console.log(sendback);
			send(JSON.stringify(hooks_cell) + "-h00oOOoks-");
			return hooks_retval;
		}
	}
}

setTimeout(function() {
    Java.perform(function() {
        // enumerate all classes
		//enumtrace("com.example.TestAct");
		console.log("In ..");

		var x = {{ hookslist }};
		var val = "";
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