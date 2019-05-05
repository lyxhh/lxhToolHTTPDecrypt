var {{ method_var }} = "{{ method_name }}";
var {{ index_var }} = {{ index }};
var {{ clazz_var }} = Java.use("{{ clazz_name }}");
var {{ clazz_var }}_{{ method_var }} = null;

var returntype = null;
{{ clazz_var }}_{{ method_var }}  = eval('{{ clazz_var }}[{{ method_var }}].overloads[{{ index_var }}]');

{{ clazz_var }}_{{ method_var }}.implementation = function() {
    var findhook_arg_type = "";
    for (var index = 0; index < arguments.length; index++) {
        // console.log(typeof (index) + index);

    // for (var index = 0; index < method_hook.argumentTypes.length; index++) {
        if (0 == index){
            // console.log(String({{ clazz_var }}_{{ method_var }}.argumentTypes[index]["className"]));
            findhook_arg_type += String({{ clazz_var }}_{{ method_var }}.argumentTypes[index]["className"]);
        } else{
            findhook_arg_type += "," + String({{ clazz_var }}_{{ method_var }}.argumentTypes[index]["className"]);
        }
    }
    returntype = String({{ clazz_var }}_{{ method_var }}.returnType['className']);
    retval = this[{{ method_var }}].apply(this, arguments);
    sendback['Methodinfo'] = returntype + " {{ clazz_name }}.{{ method_name }}(" + findhook_arg_type + ")";
    sendback['Args'] = arguments;
    sendback['Retval'] = retval;
    sendback['methodtag'] = "{{ methodtag }}";
    send(JSON.stringify(sendback,null,4) + signature);
    return retval;
};
