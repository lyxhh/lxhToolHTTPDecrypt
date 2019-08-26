{{ method_var }}: function({{ args }}){
        Java.perform(function () {
            try{
                var {{ clazz_var }} = Java.use("{{clazz_name}}");
                var temp{{ clazz_var }} = undefined;
                Java.choose("{{clazz_name}}", {
                    "onMatch": function (instance) {
                        temp{{ clazz_var }} = instance;
                        return 'stop';
                    },
                    "onComplete": function () {
                        if (temp{{ clazz_var }} === undefined){
                            temp{{ clazz_var }} = {{ clazz_var }}.$new();
                        }
                    }
                });
                // console.log(temp{{ clazz_var }});
                rpc_result = temp{{ clazz_var }}.{{ method_name }}({{ args }});
            }catch(e){console.log(e + " 实例函数参数不为空，自动构造实例对象失败，请自行前往Export_Template_Instance.js构造")}
        });
        return rpc_result;
    },