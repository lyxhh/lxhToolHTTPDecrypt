var {{ methodtag }} = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"]'); 

var {{ methodtag }}_argumentTypes = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].argumentTypes'); 
var {{ methodtag }}_returnType = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].returnType'); 

var {{ methodtag }}_sendback = {};

var {{ methodtag }}_args = {};

Interceptor.attach({{ methodtag }}.implementation, {
   onEnter: function (args) {

        var argTypes = "(";
        var argCount = ("{{method_name}}".match(/:/g) || []).length;

        if(0 == argCount){
            argTypes = "(";
            {{ methodtag }}_sendback['argument'] = "";
        }

        for (var i = 0; i < argCount; i++) {

            if (isObjC(args[i+2])) {
                argTypes += (i == 0) ? ObjC.Object(args[i+2]).$className: "," + ObjC.Object(args[i+2]).$className;
                {{ methodtag }}_args[i] = ObjC.Object(args[i+2]).toString();
            }else{
                argTypes += (i == 0) ? {{ methodtag }}_argumentTypes[i+2]: "," + {{ methodtag }}_argumentTypes[i+2];
                {{ methodtag }}_args[i] = args[i+2].toInt32();
            }
        }
        argTypes += ")";
        {{ methodtag }}_sendback['stack'] = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).reverse().join("--->");
        this.methodinfo = "(" + {{ methodtag }}_returnType + ")" + "{{ clazz_name }}['{{method_name}}']" + argTypes;
        {{ methodtag }}_sendback['uri'] = this.methodinfo;
        {{ methodtag }}_sendback['argument'] = {{ methodtag }}_args;
        send(JSON.stringify({{ methodtag }}_sendback,null, 4) + signature);
        var recv_iosdata = "";

        var op = recv('input', function(value) {
            recv_iosdata = value.payload;
            // console.log("revc: " + recv_data);
        });
        op.wait();

        var data_info = JSON.parse(recv_iosdata);
        var recv_arg = data_info.argument;
        // console.log(recv_iosdata);

        for (var i = 0; i < argCount; i++) {
             
            if (isObjC(args[i+2]) && ObjC.Object(args[i+2]).$className == "__NSCFConstantString") {
                //修改NSString 类型
                // console.log(i+ ": " +ObjC.Object(args[i+2]).$className);
                args[i+2]  = ObjC.classes.NSString.stringWithString_(recv_arg[i]);
            }else if ("int" == {{ methodtag }}_argumentTypes[i+2] || "bool" == {{ methodtag }}_argumentTypes[i+2]) {
                //修改int 与bool
                args[i+2]  = ptr(recv_arg[i]);
            }else{
                //其他数据类型 直接跳过,不处理。
                continue;
            }
        }

    },
    onLeave: function (retval) {
        // (type)values
        var RetvalResults = "";
        if (isObjC(retval)) {
            RetvalResults = ObjC.Object(retval).toString();
            // console.log('retVal:'+ObjC.Object(retval).$className+ObjC.Object(retval).toString() );
        }else{
            RetvalResults = retval.toInt32();
            // console.log('retVal:'+retval.toInt32());
        }
        // this.ios_hooks_cell['Retval'] = RetvalResults;
        // // send()
        // this.ios_hooks_cell['methodtag'] = "{{ methodtag }}";
        send(this.methodinfo  + " after Change argument ,Retval is ----->" + RetvalResults + "-se00nood00tooag-");
    },
});