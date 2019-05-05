{{ method_var }}: function({{ args }}){
        Java.perform(function () {
            // return method + arg;
            try{
                var {{ clazz_var }} = Java.use("{{clazz_name}}");
                result = {{ clazz_var }}.{{ method_name }}({{ args }});
                //a为static函数
                //f = Hrida.$new(); 非static函数需要new一个实例
                // console.log("myfunc result: "+bytesToHex(result));
            }catch(e){console.log(e)}
        });
        return result;
    },