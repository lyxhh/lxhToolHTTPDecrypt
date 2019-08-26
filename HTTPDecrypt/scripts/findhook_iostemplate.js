var {{ methodtag }} = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"]'); 

var {{ methodtag }}_argumentTypes = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].argumentTypes'); 
var {{ methodtag }}_returnType = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].returnType'); 

Interceptor.attach({{ methodtag }}.implementation, {
   onEnter: function (args) {
        this.ios_hooks_cell = {}; 
        console.log({{ methodtag }}_argumentTypes);
        var argTypes = "(";
        var argCount = ("{{method_name}}".match(/:/g) || []).length;

        var ParameterResults = {};
        if(0 == argCount){
            ParameterResults[0] = "None";
            argTypes = "(";
        }

        for (var i = 0; i < argCount; i++) {
            
            // argTypes += (i == 0) ? {{ methodtag }}_argumentTypes[i+2]: ", " + {{ methodtag }}_argumentTypes[i+2]

            if (isObjC(args[i+2])) {
                argTypes += (i == 0) ? ObjC.Object(args[i+2]).$className: "," + ObjC.Object(args[i+2]).$class;
                // ParameterResults[i] =   "("+ ObjC.Object(args[i+2]).$className  +")"+ ObjC.Object(args[i+2]).toString();
                ParameterResults[i] =   ObjC.Object(args[i+2]).toString();
            }else{
                argTypes += (i == 0) ? {{ methodtag }}_argumentTypes[i+2]: "," + {{ methodtag }}_argumentTypes[i+2];
            	// ParameterResults[i] =  "(BaseType)"+ args[i+2].toInt32();
            	ParameterResults[i] =  args[i+2].toInt32();
            }
        }
        argTypes += ")";
        this.ios_hooks_cell['Methodinfo'] = "{{ clazz_name }}['{{method_name}}']" + argTypes;
        // this.ios_hooks_cell['stacklist'] = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("->>>>");
        this.ios_hooks_cell['Args'] = ParameterResults;
    },
    onLeave: function (retval) {
        // (type)values
        var RetvalResults = "";
        if (isObjC(retval)) {
            RetvalResults = "(" + ObjC.Object(retval).$className +"):" + ObjC.Object(retval).toString();
            // RetvalResults = "(" + {{ methodtag }}_returnType +")" + ObjC.Object(retval).toString();
            // console.log('retVal:'+ObjC.Object(retval).$className+ObjC.Object(retval).toString() );
        }else{
            RetvalResults = "(" + {{ methodtag }}_returnType +")"+ retval.toInt32();
            // console.log('retVal:'+retval.toInt32());
        }
        this.ios_hooks_cell['Retval'] = RetvalResults;
        // send()
        this.ios_hooks_cell['methodtag'] = "{{ methodtag }}";
        send(JSON.stringify(this.ios_hooks_cell,null,4) + "-fi0n0dh0o0ok-");
    },
});