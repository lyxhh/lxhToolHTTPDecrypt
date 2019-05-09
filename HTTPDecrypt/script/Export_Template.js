{{ method_var }}: function({{ args }}){
        Java.perform(function () {
            // return method + arg;
            try{
                var {{ clazz_var }} = Java.use("{{clazz_name}}");
                rpc_result = {{ clazz_var }}.{{ method_name }}({{ args }});
            }catch(e){console.log(e)}
        });
        return rpc_result;
    },