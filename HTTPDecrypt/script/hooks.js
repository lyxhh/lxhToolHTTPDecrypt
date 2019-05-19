var hooks_clazz_Thread = null;
var hooks_line = '-lioonooe-';
var hooks_type = '';
var hooks_args_index = '';
var hooks_retval_dump = '';
var hooks_datatype = '';
var hooks_ret_type = '';
var hooks_retval = "";
var hooks_cell = "";
var hooks_hook = null;

function getCaller(){
	// return hooks_clazz_Thread.currentThread().getStackTrace().reverse().toString().replace(/,/g,linebreak);
	return hooks_clazz_Thread.currentThread().getStackTrace().slice(2,5).reverse().toString().replace(/,/g,"-lineline-");
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

function uniqBy(arr) {
  var seen = {};
  return arr.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}


function traceClass(targetClass)
{
    try {
        hooks_hook = Java.use(targetClass);
		var methods = hooks_hook.class.getDeclaredMethods();
		// var Modifier = Java.use("java.lang.reflect.Modifier");
		hooks_hook.$dispose;
		var parsedMethods = [];
		methods.forEach(function(method) {
			parsedMethods.push(method.toString().replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)\(/)[1]);
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
    try {   
            var targetClassMethod = targetClass+'.'+ targetMethod;
            if ({{ options }}){
            // console.log("11111");
                var hookClazz = Java.use(targetClass);
                var overloadCount = hookClazz[targetMethod].overloads.length;
                hooks_clazz_Thread = Java.use("java.lang.Thread");
                var List_hook = null;
                for (var i = 0; i < overloadCount; i++) {
                    // console.log("222");
                    List_hook = eval('hookClazz[targetMethod].overloads[i]');
                    // console.log("444");
                    List_hook.implementation = function () {
                        // console.log("3333");
                        // 打印参数
                        var arg_dump = '';
                        var arg_type = '';
                        var method_stack = '';

                        for (var index = 0; index < arguments.length; index++) {
                            // for (var index = 0; index < method_hook.argumentTypes.length; index++) {
                            hooks_args_index = arguments[index];
                            hooks_type = typeof (hooks_args_index);
                            // type = method_hook.argumentTypes[index]["className"];
                            hooks_datatype = getDataType(hooks_args_index);

                            arg_type += (hooks_line + 'argType' + index.toString() + " : " + String(hooks_type));
                            // console.log(arg_type);
                            if (hooks_datatype == "Array") {
                                // hex_arg =  arrayTohex(args_index);
                                arg_dump += ("arg" + index.toString() + ": " + JSON.stringify(hooks_args_index) + hooks_line);
                            } else {
                                arg_dump += ("arg" + index.toString() + ": " + String(hooks_args_index) + hooks_line);
                            }
                        }
                        hooks_ret_type = String(List_hook.returnType['className']);
                        // console.log(targetClassMethod);
                        hooks_retval = this[targetMethod].apply(this, arguments); // rare crash (Frida bug?)

                        if (hooks_ret_type == "[B") {
                            // new_retval=  arrayTohex(retval);
                            hooks_retval_dump = "(" + hooks_ret_type + ') : ' + JSON.stringify(hooks_retval);
                        } else {
                            hooks_retval_dump = "(" + hooks_ret_type + ') : ' + String(hooks_retval);
                        }

                        // console.log(datatype +": "+ arg_dump);
                        method_stack += getCaller();
                        console.log(hooks_ret_type + " "+targetClassMethod);
                        hooks_cell = {
                            "method_stack": method_stack,
                            "arg_type": arg_type,
                            "arg_dump": arg_dump,
                            "retval_dump": hooks_retval_dump,
                            "targetClassMethod": targetClassMethod
                        };
                        // console.log(JSON.stringify(hooks_cell));
                        send(JSON.stringify(hooks_cell) + "-h00oOOoks-");
                        return hooks_retval;
                    }
                }
            }
            // }
	}catch (err) {
        console.log("hooks function traceMethod is " + targetClassMethod +" error: "+ err);
    }
}


setImmediate(function() {
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
});