var {{ methodtag }} = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"]'); 

var {{ methodtag }}_argumentTypes = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].argumentTypes'); 
var {{ methodtag }}_returnType = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].returnType'); 



Interceptor.attach({{ methodtag }}.implementation, {
   onEnter: function (args) {
        this.{{ methodtag }}_sendback = {};
        // console.log({{ methodtag }}_argumentTypes);
        this.argTypes = "(";
        var argCount = ("{{method_name}}".match(/:/g) || []).length;

        if(0 == argCount){
            this.argTypes = "(";
        }

        for (var i = 0; i < argCount; i++) {
            
            if (isObjC(args[i+2])) {
                this.argTypes += (i == 0) ? ObjC.Object(args[i+2]).$className: "," + ObjC.Object(args[i+2]).$className;
            }else{
                this.argTypes += (i == 0) ? {{ methodtag }}_argumentTypes[i+2]: "," + {{ methodtag }}_argumentTypes[i+2];
            }
        }
        this.argTypes += ")";
        this.{{ methodtag }}_sendback['stack'] = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).reverse().join("--->");

    },
    onLeave: function (retval) {
        var retvaltype = "";
        if (isObjC(retval)) {
            this.{{ methodtag }}_sendback['retval'] = ObjC.Object(retval).toString();
            retvaltype = ObjC.Object(retval).$className;
            // console.log('retVal:'+ObjC.Object(retval).$className+ObjC.Object(retval).toString() );
        }else{
            retvaltype = {{ methodtag }}_returnType;
            this.{{ methodtag }}_sendback['retval']  = retval.toInt32();
            // console.log('retVal:'+retval.toInt32());
        }

        this.{{ methodtag }}_sendback['uri'] = "(" + retvaltype + ")" + "{{ clazz_name }}['{{method_name}}']" + this.argTypes;
    

        var recv_iosdata = "";
        send(JSON.stringify(this.{{ methodtag }}_sendback,null, 4) + signature);
        var op = recv('input', function(value) {
            recv_iosdata = value.payload;
            // console.log("revc: " + recv_data);
        });
        op.wait();

        var data_info = JSON.parse(recv_iosdata);
        var recv_retval = data_info.retval;

        if (isObjC(retval) && ObjC.Object(retval).$className == "__NSCFConstantString") {
            //修改NSString 类型
            // console.log(i+ ": " +ObjC.Object(args[i+2]).$className);
            var tempstr  = ObjC.classes.NSString.stringWithString_(recv_retval);
            retval.replace(tempstr);
            send(this.methodinfo  + " after Change retval ,Retval is  ----->" + ObjC.Object(retval).toString() + "-se00nood00tooag-");
        }else if ("int" == retvaltype || "bool" == retvaltype) {
            //修改int 与bool
            retval.replace(ptr(recv_retval));
            send(this.methodinfo  + " after Change retval ,Retval is  ----->" + retval.toInt32() + "-se00nood00tooag-");
        }else{
            //其他数据类型 直接跳过,不处理。
            send(this.methodinfo  + " The return value is not modified ----->" + recv_retval + "-se00nood00tooag-");
        }

    }
});