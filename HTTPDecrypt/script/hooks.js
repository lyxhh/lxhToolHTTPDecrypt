var hooks_clazz_Thread = null;
var hooks_line = '-lioonooe-';
var hooks_cell = "";

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
        var hooks_hook = Java.use(targetClass);
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
				traceMethod(targetClass, targetMethod);
		});
	}catch (err) {}
}

function traceMethod(targetClass,targetMethod){
	// console.log("123");
    // try {
            var targetClassMethod = targetClass+'.'+ targetMethod;
            if ({{ options }}){
            // console.log("11111");
                var hookClazz = Java.use(targetClass);
                if (hookClazz == null || typeof hookClazz[targetMethod] === 'undefined') {
                    return;
                }
                var overloadCount = hookClazz[targetMethod].overloads.length;

                hooks_clazz_Thread = Java.use("java.lang.Thread");
                var List_hook = null;

                for (var i = 0; i < overloadCount; i++) {

                    try {
                        List_hook = eval('hookClazz[targetMethod].overloads[i]');
                    }catch (e) {
                        console.log("[&&] List_hook error " + e.message);
                    }
                    // var mArgs  = hookClazz[targetMethod].overloads[i].argumentTypes;

                    List_hook.implementation = function () {
                        // 打印参数
                        var arg_dump = '';
                        var arg_type = '';
                        var method_stack = '';
                        var args = arguments;

                        for (var index = 0; index < args.length; index++) {
                            var value = '';
                            if (args[index] === null ||  typeof args[index] === 'undefined'){
                                value = 'null';
                            } else{
                                if (typeof args[index] === 'object') {
                                    value = JSON.stringify(args[index]);
                                } else {
                                    value = args[index].toString();
                                }
                            }
                            arg_type += (hooks_line + 'argType' + index.toString() + " : " + typeof args[index]);
                            // arg_type += (hooks_line + 'argType' + index.toString() + " : " + mArgs[index]['className'].toString()); // Error
                            arg_dump += ("arg" + index.toString() + ": " + value + hooks_line);
                        }
                        try {
                            var hooks_retval = this[targetMethod].apply(this, args); // cannot call instance method without an instance？
                        }catch (e) {
                            // hooks_retval = hookClazz.$new().targetMethod.apply(this, arguments);
                            return '';
                            // console.log(e.message + " "+targetMethod +" "+ targetClassMethod);
                        }

                        var hooks_ret_type = String(List_hook.returnType['className']);

                        if (hooks_ret_type == "[B") {
                            var hooks_retval_dump = "(" + hooks_ret_type + ') : ' + JSON.stringify(hooks_retval);
                        } else {
                            var hooks_retval_dump = "(" + hooks_ret_type + ') : ' + String(hooks_retval);
                        }

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
                hookClazz.$dispose();
            }
	// }catch (err) {
    //     console.log("hooks function traceMethod is " + targetClassMethod +" error: "+ err);
    // }
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