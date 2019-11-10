{{ method_var }}: function({{ args }}){
	if(ObjC.available) {
		try {
            {{ clazz_var }}  = ObjC.chooseSync(ObjC.classes.{{ clazz_name }})[0];
            if({{ clazz_var }} === undefined){
                var {{ clazz_var }}  = ObjC.classes.{{ clazz_name }}.alloc();
                if ({{ clazz_var }} === undefined ) {
                    rpc_result_ios = "Class instance object construction failed, please Generate export instance script file to construct it yourself";
                    return rpc_result_ios.toString();
                }
            }

            rpc_result_ios = {{ clazz_var }}["{{method_name}}"]({{ args }});
            // send(JSON.stringify({"aa":"bb","aa1":"bbb"})+'-cusoto0oom0sc0ri0pt-')
    	}catch (e) {
			send("{{ method_var }}, " + e + "-er00roo000r-");
		}
        return rpc_result_ios.toString();
	}
},