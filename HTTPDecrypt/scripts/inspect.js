
var inspect_signature_send = "-in00sOpOeooct-";
setImmediate(function() {
    send("inspect running..." + "-se00nood00tooag-");
    var inspect_sendback = { "methodInfo": [], "isAndroid": "False"};
    var inspect_cell = null;

    try {
        if (ObjC.available) {
            var className = "{{ clazz_name }}";

            inspect_sendback['classname'] = "{{ clazz_name }}";
            // console.log(className);
            // var ownMethods = ObjC.classes[targetClass].$ownMethods;
            // ObjC.classes[clazz_name]$ownMethods
            var ownMethods = eval("ObjC.classes[className].$ownMethods"); // 不包含父类的公开方法

            ownMethods.forEach(function (method) {
                var argCount = (method.match(/:/g) || []).length;
                inspect_cell = {'methodInfo': method, 'length': argCount};
                inspect_sendback.methodInfo.push(inspect_cell)

            });

            send(JSON.stringify(inspect_sendback) + inspect_signature_send)
            // console.log(JSON.stringify(inspect_sendback));
        } else if (Java.available) {
            Java.perform(function () {

                inspect_sendback["isAndroid"] = "True";

                var clazz_name = "{{ clazz_name }}";
                var method_name = "{{ method_name }}";
                inspect_sendback['classname'] = "{{ clazz_name }}";
                inspect_sendback['methodname'] = "{{ method_name }}";

                var class_hook = Java.use(clazz_name);
                var overloadz_class_hook = eval("class_hook[method_name].overloads");
                var ovl_count_class_hook = overloadz_class_hook.length;
                //console.log(ovl_count_class_hook);
                for (var i = 0; i < ovl_count_class_hook; i++) {
                    var method_hook = eval("class_hook[method_name].overloads[i]");
                    var arg_type = [];
                    var ret_type = method_hook.returnType['className'];

                    for (var index = 0; index < method_hook.argumentTypes.length; index++) {
                        arg_type.push(method_hook.argumentTypes[index]["className"])
                    }

                    inspect_cell = {
                        'Arg': JSON.stringify(arg_type),
                        'Return Value': JSON.stringify(ret_type),
                        'length': method_hook.argumentTypes.length
                    };
                    // console.log(arg_type + ret_type);
                    inspect_sendback.methodInfo.push(inspect_cell)
                }
                // console.log(inspect_sendback);
                send(JSON.stringify(inspect_sendback) + inspect_signature_send)
            });
        }
    }catch (e) {
        send(e + "-er00roo000r-")
    }
});