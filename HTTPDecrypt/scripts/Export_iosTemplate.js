{{ method_var }}: function({{ args }}){
	if(ObjC.available) {
		try {
            var {{ clazz_var }} = ObjC.classes.{{ clazz_name }};
            rpc_result_ios = {{ clazz_var }}["{{method_name}}"]({{ args }});
			// send(JSON.stringify({"aa":"bb","aa1":"bbb"})+'-cusoto0oom0sc0ri0pt-')
		}catch (e) {
			send("{{ method_var }}, " + e + "-er00roo000r-");
		}
		return rpc_result_ios.toString();
	}
	
},