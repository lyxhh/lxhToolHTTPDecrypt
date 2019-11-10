{{ method_var }}: function({{ args }}){
        Java.perform(function () {
            try{
                var {{ clazz_var }} = Java.use("{{clazz_name}}");
                var temp{{ clazz_var }} = undefined;
				
                Java.choose("{{clazz_name}}", {
                    "onMatch": function (instance) {
                        temp{{ clazz_var }} = instance;
						send("find instance.." + "-se00nood00tooag-");
                        return 'stop';
                    },
                    "onComplete": function () {
                        if (temp{{ clazz_var }} === undefined){
                            temp{{ clazz_var }} = {{ clazz_var }}.$new();
                        }
                    }
                });
                // send(JSON.stringify({"aa":"bb","aa1":"bbb"})+'-cusoto0oom0sc0ri0pt-')
                rpc_result = temp{{ clazz_var }}.{{ method_name }}({{ args }});
            }catch(e){send("{{ method_var }}, " + e + "-er00roo000r-")}
        });
        return rpc_result;
    },