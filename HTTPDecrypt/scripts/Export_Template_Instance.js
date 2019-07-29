{{ method_var }}: function({{ args }}){
        Java.perform(function () {
            try{
                var {{ clazz_var }} = Java.use("{{clazz_name}}");
                var temp{{ clazz_var }} = {{ clazz_var }}.$new();
                rpc_result = temp{{ clazz_var }}.{{ method_name }}({{ args }});
            }catch(e){console.log(e + "实例函数参数不为空，构造失败，请自行前往Export_Template_Instance.js构造")}
        });
        return rpc_result;
    },