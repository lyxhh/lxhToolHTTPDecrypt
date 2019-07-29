var {{ method_var }} = "{{ method_name }}";
var {{ index_var }} = {{ index }};
var {{ clazz_var }} = Java.use("{{ clazz_name }}");
var {{ clazz_var }}_{{ method_var }} = null;

{{ clazz_var }}_{{ method_var }}  = eval('{{ clazz_var }}[{{ method_var }}].overloads[{{ index_var }}]');
doburp_clazz_Thread = Java.use("java.lang.Thread");

{{ clazz_var }}_{{ method_var }}.implementation = function() {
    var method_stack = "";
    method_stack += getCaller();
    sendback['stack'] = method_stack;
    var arg_type = "";
    var args = arguments;
    var srcargs = {};
    var arg_len = args.length;
    var ret_type = String({{ clazz_var }}_{{ method_var }}.returnType['className']);
    for (var index = 0; index < args.length; index++) { (0 == index)?arg_type += (typeof args[index] ):arg_type += ("," + typeof args[index] )}
    var uri = "("+ret_type +")"+ "{{ clazz_name }}.{{ method_name }}("+ arg_type + ")";

    if (0 != arg_len) {
        send(uri + " argument before -> " + JSON.stringify(args) + "-se00nood00tooag-");
        for (var v = 0; v < arg_len; v++) {
            if ("object" == typeof args[v] && "number" == typeof args[v].length) {
                srcargs[v] = JSON.stringify(args[v]);
                // console.log("arg is Array");
            } else if ("object" == typeof args[v]) {
                srcargs[v] = String(args[v]);
                // console.log("arg is object");
            } else {
                srcargs[v] = args[v];
                // console.log("arg is other type");
            }
        }
        sendback['argument'] = srcargs;
    }else {
        sendback['argument'] = args;
    }

    try {
        if ("void" != ret_type) {
            retval = this[{{ method_var }}].apply(this, arguments);
            if ("object" == typeof retval && "number" == typeof retval.length) {
                send(uri + " retval   before -> " + JSON.stringify(retval) + "-se00nood00tooag-");
                sendback["retval"] = JSON.stringify(retval);
                // console.log("retval is Array");
            }else if ("object" == typeof retval) {
                send(uri + " retval   before -> " + String(retval) + "-se00nood00tooag-");
                sendback["retval"] = String(retval);
                // console.log("retval is object");
            } else {
                send(uri + " retval   before -> " + JSON.stringify(retval) + "-se00nood00tooag-");
                sendback["retval"] = retval;
                // console.log("retval is base type");
            }
        }else {
            retval = undefined;
            sendback["retval"] = String(retval);
            // send(uri + " before -> " + String(retval) + "-se00nood00tooag-");
        }
    } catch (err) {retval = null;console.log("Exception - cannot compute retval.." + JSON.stringify(err))}

    sendback['uri'] = uri;
    send(JSON.stringify(sendback,null, 4) + signature);

    var op = recv('input', function(value) {
        recv_data = value.payload;
        // console.log("revc: " + recv_data);
    });
    op.wait();

    var data_info = JSON.parse(recv_data);
    var newretval = data_info.retval;
    var recv_arg = data_info.argument;
    // console.log("[*]"+String(newretval) + "[*]:[*]" + JSON.stringify(retval));

    if (0 == arg_len) {
        if ("object" == typeof retval && "number" == typeof retval.length) {
            // console.log("Arg0 return is Array");
            if (newretval != JSON.stringify(retval)){
                retval = eval(newretval);
            }
            send(uri + " retval   after  -> " + JSON.stringify(retval) + "-se00nood00tooag-");
        } else if("object" == typeof retval ){
            // console.log("Arg0 return is object");
            //对象类型不处理,直接返回。
            send(uri + " retval   after  -> " + String(retval) + "-se00nood00tooag-");
            // return retval
        } else {
            // console.log("Arg0 return base type");
            if (newretval != retval) {
                retval = retval.constructor(newretval);
            }
            send(uri + " retval   after  -> " + JSON.stringify(retval) + "-se00nood00tooag-");
        }
        return retval
    } else if ("void" == ret_type){
        // send(uri + " before -> " + JSON.stringify(args) + "-se00nood00tooag-");
        for (var i = 0; i < arg_len; i++) {
            if ("object" == typeof args[i] && "number" == typeof args[i].length){
                // console.log("Arg is Array");
                args[i] = eval(recv_arg[i]);
            }else if("object" == typeof args[i] ){
                // console.log("Arg is object");
                //对象类型，不处理直接返回
                continue;
            } else {
                // console.log("Arg is other type");
                args[i] = args[i].constructor(recv_arg[i]);
            }
        }
        send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
        retval = this[{{ method_var }}].apply(this, args);
        return retval
    } else{
            if ("object" == typeof retval && "number" == typeof retval.length) {
                // console.log("ArrayTypeReturnValue");
                if (newretval != JSON.stringify(retval)) {
                    // console.log("3444444");
                    retval = eval(newretval);
                }else {
                    // console.log("4");
                    for (var i = 0; i < arg_len; i++) {
                        if ("object" == typeof args[i] && "number" == typeof args[i].length){
                            args[i] = eval(recv_arg[i]);
                        }else if("object" == typeof args[i] ){
                                continue;
                        } else {
                            args[i] = args[i].constructor(recv_arg[i])
                        }
                    }
                    retval = this[{{ method_var }}].apply(this, args);
                }
                send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
                send(uri + " retval   after  -> " + JSON.stringify(retval) + "-se00nood00tooag-");
                return retval;
            }else if("object" == typeof retval ){
                // send(uri + " before -> " + JSON.stringify(args) + "-se00nood00tooag-");
                console.log("ObjectTypeReturnValue");
                for (var i = 0; i < arg_len; i++) {
                    if ("object" == typeof args[i] && "number" == typeof args[i].length){
                         args[i] = eval(recv_arg[i]);
                    }else if ("object" == typeof args[i] ){
                        continue;
                    } else {
                        args[i] = args[i].constructor(recv_arg[i])
                    }
                }
                this[{{ method_var }}].apply(this, args);
                send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
                send(uri + " retval   after  -> " + String(retval) + "-se00nood00tooag-");
                return retval;
            } else {
                    // console.log("BaseTypeReturnValue");
                    if (newretval != retval) {
                        retval = retval.constructor(newretval);
                    }else {
                            for (var i = 0; i < arg_len; i++) {
                                if ("object" == typeof args[i] && "number" == typeof args[i].length){
                                    // console.log("Arg is Array");
                                    args[i] = eval(recv_arg[i]);
                                }else if ("object" == typeof args[i] ){
                                    // console.log("Arg is object ");
                                    continue;
                                } else {
                                    // console.log("Arg is basetype");
                                    args[i] = args[i].constructor(recv_arg[i])
                                }
                            }
                            retval = this[{{ method_var }}].apply(this, args);
                    }
                    send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
                    send(uri + " retval   after  -> " + JSON.stringify(retval) + "-se00nood00tooag-");
                    return retval;
            }
        }
    };