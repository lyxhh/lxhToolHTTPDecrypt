{{ method_var }}: function({{ args }}){
        Java.perform(function () {
            try{
				// var context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
                var {{ clazz_var }} = Java.use("{{clazz_name}}");
                rpc_result = {{ clazz_var }}.{{ method_name }}({{ args }});
                // send(JSON.stringify({"aa":"bb","aa1":"bbb"})+'-cusoto0oom0sc0ri0pt-')
            }catch(e){send("{{ method_var }}, " + e + "-er00roo000r-")}
        });
        return rpc_result;
    },