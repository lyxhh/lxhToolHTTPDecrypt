{{ method_var }}: function({{ args }}){
	if(ObjC.available) {
		
        var {{ clazz_var }}  = ObjC.classes.{{ clazz_name }}.alloc();
        if({{ clazz_var }} === undefined){
        	{{ clazz_var }}  = ObjC.chooseSync(ObjC.classes.{{ clazz_name }})[0];
        	if ({{ clazz_var }} === undefined ) {
        		rpc_result_ios = "Class instance object construction failed, please go to Export_Template_Instance.js file to construct it yourself";
        		return rpc_result_ios.toString();
        	}
        }

        rpc_result_ios = {{ clazz_var }}["{{method_name}}"]({{ args }});    
        
    	// console.log(rpc_result_ios);
    	// send(rpc_result_ios+"-se00nood00tooag-");
    	return rpc_result_ios.toString();
	}
	
},