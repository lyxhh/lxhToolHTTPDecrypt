{{ method_var }}: function({{ args }}){
	if(ObjC.available) {
    	var {{ clazz_var }} = ObjC.classes.{{ clazz_name }}; 
    	rpc_result_ios = {{ clazz_var }}["{{method_name}}"]({{ args }});    
    	// console.log(rpc_result_ios);
    	// send(rpc_result_ios+"-se00nood00tooag-");
    	return rpc_result_ios.toString();
	}
	
},