var {{ method_var }} = "{{ method_name }}";
var {{ index_var }} = {{ index }};
var {{ clazz_var }} = Java.use("{{ clazz_name }}");
var {{ clazz_var }}_{{ method_var }} = null;

var returntype = null;
{{ clazz_var }}_{{ method_var }}  = eval('{{ clazz_var }}[{{ method_var }}].overloads[{{ index_var }}]');

{{ clazz_var }}_{{ method_var }}.implementation = function() {
    // var sendback = ''
    var args = arguments;
    var ret_type = String({{ clazz_var }}_{{ method_var }}.returnType['className']);
    try {
        if ("void" != ret_type) {
            retval = this[{{ method_var }}].apply(this, arguments);
        }
    } catch (err) {retval = null;console.log("Exception - cannot compute retval.." + JSON.stringify(err))}

    console.log("[*] before: " + JSON.stringify(retval));

    datatype = getDataType(retval);
    if (datatype == "Array") {
        sendback["retval"] = JSON.stringify(retval);
    }else {sendback["retval"] = retval}
    // sendback.retval.push(retval);
    // if (retval != null){
    //     ret_constructor = retval.constructor;
    // }
    sendback['argument'] = args;
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
    var arg_len = args.length;
    // console.log("typeof retval: "+typeof retval);
    if (0 == arg_len) {
        // console.log("arg_len is 0");
        // if ("object" == typeof retval && "number" == typeof retval.length) {
        if (retval instanceof Array) {
            if (newretval != JSON.stringify(retval)){
                for (var i = 0; i < newretval.length; i++) {
                    retval[i] = retval[i].constructor(newretval[i])
                }
                // return retval;
            }
            // return retval;
        } else if("object" == typeof retval ){
            console.log("[*] after: " + String(retval));
            // console.log("[*] after: " + retval);
            return retval
        } else {
            if (newretval != retval) {
                retval = retval.constructor(newretval);
                // return retval;
            }
            // return retval;
        }
        console.log("[*] after: " + String(retval));
        return retval
    } else if ("void" == ret_type){
        // console.log("void");
        for (var i = 0; i < arg_len; i++) {
            // if ("object" == typeof recv_arg[i] && "number" == typeof recv_arg[i].length){
            if (recv_arg[i] instanceof Array){
                for (var j = 0;j<recv_arg[i].length; j++){
                    args[i][j] = args[i][j].constructor(recv_arg[i][j]);
                }
                // console.log("1");
            }else if("object" == typeof recv_arg[i] ){
                // console.log("2");
                // args[i] = args[i].constructor(recv_arg[i]);
                continue;

            } else {
                // console.log("args",typeof recv_arg[i]);
                // console.log("3");
                args[i] = args[i].constructor(recv_arg[i]);
            }
        }
        retval = this[{{ method_var }}].apply(this, args);
        console.log("[*] after: " + String(retval));
        return retval
    } else{
            // console.log("2");
            // if ("undefined" == typeof retval ){
            //      console.log("2");
            //      return retval;
            // }
            // console.log(typeof retval);
            // if ("object" == typeof retval && "number" == typeof retval.length) {
            if (retval instanceof Array) {
                if (newretval != JSON.stringify(retval)) {
                    // console.log("3");
                    for (var i = 0; i < newretval.length; i++) {
                        retval[i] = retval[i].constructor(newretval[i])
                    }
                    // return retval;
                }else {
                    // console.log("4");
                    for (var i = 0; i < arg_len; i++) {
                        // if ("object" == typeof recv_arg[i] && "number" == typeof recv_arg[i].length){
                        if (recv_arg[i] instanceof Array){
                            for (var j = 0;j<recv_arg[i].length; j++){
                                args[i][j] = args[i][j].constructor(recv_arg[i][j]);
                            }
                        }else if("object" == typeof recv_arg[i] ){
                                continue;
                        } else {
                            args[i] = args[i].constructor(recv_arg[i])
                        }
                    }
                    retval = this[{{ method_var }}].apply(this, args);
                    // console.log("ret: "+retval);
                    // return retval;
                }
                console.log("[*] after: " + JSON.stringify(retval));
                return retval;
            }else if("object" == typeof retval ){
                for (var i = 0; i < arg_len; i++) {
                    // console.log(typeof recv_arg[i] + i);
                    // if ("object" == typeof recv_arg[i] && "number" == typeof recv_arg[i].length){
                    if (recv_arg[i] instanceof Array){
                        for (var j = 0;j<recv_arg[i].length; j++){
                            args[i][j] = args[i][j].constructor(recv_arg[i][j]);
                        }
                    }else if ("object" == typeof recv_arg[i] ){
                        continue;
                    }
                    else {
                        args[i] = args[i].constructor(recv_arg[i])
                    }
                }
                retval = this[{{ method_var }}].apply(this, args);
                // console.log("[*] after: " + retval);
                console.log("[*] after: " + JSON.stringify(retval));
                // console.log('retval object1');
                return retval;
            } else {
                    // console.log("5");
                    if (newretval != retval) {
                        // console.log(typeof retval);
                        retval = retval.constructor(newretval);
                        // return retval;
                    }else {
                           // console.log("6");
                            for (var i = 0; i < arg_len; i++) {
                                // console.log(typeof recv_arg[i] + i);
                                // if ("object" == typeof recv_arg[i] && "number" == typeof recv_arg[i].length){
                                if (recv_arg[i] instanceof Array){
                                    for (var j = 0;j<recv_arg[i].length; j++){
                                        args[i][j] = args[i][j].constructor(recv_arg[i][j]);
                                    }
                                }else if ("object" == typeof recv_arg[i] ){
                                    // console.log(i+"arg is object ");
                                    continue;
                                }
                                else {
                                    args[i] = args[i].constructor(recv_arg[i])
                                }
                            }
                            retval = this[{{ method_var }}].apply(this, args);
                            // console.log("ret: "+retval);
                            // return retval;
                    }
                    // console.log("[*] after: " + retval);
                    console.log("[*] after: " + JSON.stringify(retval));
                    return retval;
            }
        }
    }