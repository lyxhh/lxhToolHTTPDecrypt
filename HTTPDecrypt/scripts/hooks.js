var hooks_clazz_Thread = null;
var hooks_line = '-lioonooe-';
var hooks_cell = "";



function main(val){
    if (ObjC.available) {
        enumObjcAllClass(val);
    }else if(Java.available) {
        enumJavaAllClass(val);
    }
}


function getCaller(){
	return hooks_clazz_Thread.currentThread().getStackTrace().slice(2,5).reverse().toString().replace(/,/g,"-lineline-");
}


function enumJavaAllClass(pattern){
    Java.perform(function() {
    	Java.enumerateLoadedClasses({
            onMatch: function(className) {
                if (className.match(pattern) {{ options }} ) {
                    send("hooks class "+ className +" all method" + "-se00nood00tooag-");
                    enumJavaClassMethod(className);
                }
            },
            onComplete: function() {
                send("hooks class enum done..." + "-se00nood00tooag-");
            }
		});
    });
}


function enumObjcAllClass(classname){
    // var className = null;
    for (var className in ObjC.classes) {
        if (ObjC.classes.hasOwnProperty(className) && className.match(classname) {{ options }}) {

            send("hook class "+ className +" all method" + "-se00nood00tooag-");
            enumObjcClassMethod(className);

        }
    }
    send("hookclass enum done..." + "-se00nood00tooag-");

}



function enumObjcClassMethod(targetClass) {     
    // var method = {}
    // var ownMethods = ObjC.classes[targetClass].$ownMethods; // 不包含父类的公开方法

    // ownMethods.forEach(function(method) {
    //  console.log(JSON.stringify(method));  //"- getInfo"  //"- sumWith:AndNumber:"

    // });
    var resolver = new ApiResolver("objc");
    resolver.enumerateMatches("*[" + targetClass + " *]", {
        onMatch: function (target) {
            // console.log(JSON.stringify(target)); //{"name":"-[MyClass getInfo]","address":"0x1007f65cc"}
            
            var targetClassMethod = target['name'];
            var address = target['address'];
            // console.log(targetClassMethod);
            send(targetClassMethod + "-se00nood00tooag-");
            var methodName = targetClassMethod.match(/^[-+]\[.*\s(.*)\]/)[1];
            // console.log(methodName);  //getInfo
            var argCount = (methodName.match(/:/g) || []).length;

            var className = targetClassMethod.match(/^[-+]\[(.*)\s/)[1];
            var methodType = targetClassMethod.match(/^([-+])/)[1];    

            var argumentTypes = ObjC.classes[className][methodType + " " + methodName].argumentTypes; // index 2开始是参数

            var returnType = ObjC.classes[className][methodType + " " + methodName].returnType;
            
            // console.log(returnType);
            if(targetClassMethod != ".cxx_destruct"){
                try{
                    Interceptor.attach(address, {

                        onEnter: function (args) {
                            this.ios_hooks_cell = {}; 
                            
                            var ParameterResults = "";
                            var argTypes = "(";
                            if(0 == argCount){
                                ParameterResults += "None";
                                argTypes = "(";
                            }
 
                            for (var i = 0; i < argCount; i++) {
                                // var sel = ObjC.selectorAsString(args[1]);
                                // console.log(sel)
                                // console.log(argumentTypes);
                                if (0 == i) {
                                    if (isObjC(args[i+2])) {
                                        argTypes += ("pointer" == argumentTypes[i+2]) ? ObjC.Object(args[i+2]).$className:argumentTypes[i+2];

                                        if ("float" == argumentTypes[i+2]) {
                                            ParameterResults +=  "arg" + i +":"+ args[i+2].readFloat();
                                        }else if ("double" == argumentTypes[i+2]) {
                                            ParameterResults +=  "arg" + i +":"+ args[i+2].readDouble();
                                        }else{
                                            ParameterResults +=  "arg" + i +":"+ ObjC.Object(args[i+2]).toString();
                                        }
                                        // ParameterResults +=  "arg" + i +":"+ "("+ ObjC.Object(args[i+2]).$className  +")"+ ObjC.Object(args[i+2]).toString();
                                        // ParameterResults +=  "arg" + i +":"+ "("+ argumentTypes[i+2]  +")"+ ObjC.Object(args[i+2]).toString();
                                        // ParameterResults +=  "arg" + i +":"+ ObjC.Object(args[i+2]).toString();
                                    }else{
                                        argTypes += argumentTypes[i+2];
                                        ParameterResults +=  "arg" + i +":"+ args[i+2].toInt32();
                                    }
                                }else{
                                    if (isObjC(args[i+2])) {
                                        argTypes += ("pointer" == argumentTypes[i+2]) ? ", " + ObjC.Object(args[i+2]).$className:", " + argumentTypes[i+2];
                                        // argTypes += ", " + ObjC.Object(args[i+2]).$className;
                                        if ("float" == argumentTypes[i+2]) {
                                            ParameterResults +=  "<br />" + "arg" + i +":"+ args[i+2].readFloat();
                                        }else if ("double" == argumentTypes[i+2]) {
                                            ParameterResults +=  "<br />" + "arg" + i +":"+ args[i+2].readDouble();
                                        }else{
                                            ParameterResults +=  "<br />" + "arg" + i +":"+ ObjC.Object(args[i+2]).toString();
                                        }
                                    }else{
                                        argTypes += ", " + argumentTypes[i+2];
                                        ParameterResults +=  "<br />" + "arg" + i +":"+ args[i+2].toInt32();
                                    }
                                }

                            }
                            argTypes += ")";
                            this.ios_hooks_cell['methodname'] = targetClassMethod + argTypes;
                            this.ios_hooks_cell['stacklist'] = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("<br />");
                            this.ios_hooks_cell['args'] = ParameterResults;
                        },
                        onLeave: function (retval) {
                            // (type)values
                            var RetvalResults = "";
                            if (isObjC(retval)) {
                                // RetvalResults = "(" + ObjC.Object(retval).$className +")" + ObjC.Object(retval).toString();
                                RetvalResults = "(" + ObjC.Object(retval).$className +"):" + ObjC.Object(retval).toString();
                                // console.log('retVal:'+ObjC.Object(retval).$className+ObjC.Object(retval).toString() );
                            }else{
                                // RetvalResults = "(BaseType)" + retval.toInt32();
                                RetvalResults = "(" + returnType +"):"+ retval.toInt32();
                                // console.log('retVal:'+retval.toInt32());
                            }
                            this.ios_hooks_cell['RetvalResults'] = RetvalResults;
                            // send()

                            send(JSON.stringify(this.ios_hooks_cell) + "-ho0ookoiooos-");
                        },

                    });
                }catch(e){
                    console.log('hook '+ targetClassMethod +' error:' + e);
                }

            }
        },
        onComplete: function () {
            send("hook " + targetClass + " all method done." + "-se00nood00tooag-");
        }
    });
}

// https://codeshare.frida.re/@mrmacete/objc-method-observer/

function isObjC(p) {
    var klass = getObjCClassPtr(p);
    return !klass.isNull();
}


var ISA_MASK = ptr('0x0000000ffffffff8');
var ISA_MAGIC_MASK = ptr('0x000003f000000001');
var ISA_MAGIC_VALUE = ptr('0x000001a000000001');

function getObjCClassPtr(p) {
    /*
     * Loosely based on:
     * https://blog.timac.org/2016/1124-testing-if-an-arbitrary-pointer-is-a-valid-objective-c-object/
     */

    if (!isReadable(p)) {
        return NULL;
    }
    var isa = p.readPointer();
    var classP = isa;
    if (classP.and(ISA_MAGIC_MASK).equals(ISA_MAGIC_VALUE)) {
        classP = isa.and(ISA_MASK);
    }
    if (isReadable(classP)) {
        return classP;
    }
    return NULL;
}

function isReadable(p) {
    try {
        p.readU8();
        return true;
    } catch (e) {
        return false;
    }
}


function uniqBy(arr) {
  var seen = {};
  return arr.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}


function enumJavaClassMethod(targetClass)
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
            HookJavaMethod(targetClass, targetMethod);
		});
	}catch (err) {}
}

function HookJavaMethod(targetClass,targetMethod){
	// console.log("123");
    try {
            var methodName = targetClass+'.'+ targetMethod;
            // if ({{ options }}){
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
                    return;
                }
                // var mArgs  = hookClazz[targetMethod].overloads[i].argumentTypes;
                List_hook.implementation = function () {
                    // 打印参数
                    var arg_dump = '';
                    var arg_type = '';
                    var method_stack = '';
                    var hooks_ret_type = '';
                    var hooks_retval_dump = '';
                    var hooks_retval ='';
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

                    hooks_ret_type = String(List_hook.returnType['className']);

                    try {
                        hooks_retval = this[targetMethod].apply(this, arguments);
                    }catch (e) {
                        console.log("apply error: " + e);
                        return this[targetMethod].apply(this, arguments);
                    }


                    if (hooks_ret_type == "[B") {
                        hooks_retval_dump = "(" + hooks_ret_type + ') : ' + JSON.stringify(hooks_retval);
                    } else {
                        hooks_retval_dump = "(" + hooks_ret_type + ') : ' + String(hooks_retval);
                    }

                    method_stack += getCaller();

                    hooks_cell = {
                        "method_stack": method_stack,
                        "arg_type": arg_type,
                        "arg_dump": arg_dump,
                        "retval_dump": hooks_retval_dump,
                        "targetClassMethod": methodName
                    };

                    // console.log(JSON.stringify(hooks_cell));
                    send(JSON.stringify(hooks_cell) + "-h00oOOoks-");
                    return hooks_retval;
                }
            }
            hookClazz.$dispose();
            //}
	}catch (err) {
        console.log("HookJavaMethod " + methodName +" Error, Reason is : " + err);
        return this[targetMethod].apply(this, arguments);
    }
}


setImmediate(function() {
    send("hooks running..." + "-se00nood00tooag-");

	var x = {{ hookslist }};
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