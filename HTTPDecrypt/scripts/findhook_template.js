var {{ method_var }} = "{{ method_name }}";
var {{ index_var }} = {{ index }};
var {{ clazz_var }} = Java.use("{{ clazz_name }}");
var {{ clazz_var }}_{{ method_var }} = null;

{{ clazz_var }}_{{ method_var }}  = eval('{{ clazz_var }}[{{ method_var }}].overloads[{{ index_var }}]');
{{ clazz_var }}_{{ method_var }}.implementation = function() {

    var findhook_retval = null;
    var findhook_sendback = {};
    var findhook_returntype = null;

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
    findhook_returntype = String({{ clazz_var }}_{{ method_var }}.returnType['className']);
    findhook_retval = this[{{ method_var }}].apply(this, arguments);
    findhook_sendback['Methodinfo'] = findhook_returntype + " {{ clazz_name }}.{{ method_name }}(" + findhook_arg_type + ")";
    findhook_sendback['Args'] = arguments;
    findhook_sendback['Retval'] = findhook_retval;
    findhook_sendback['methodtag'] = "{{ methodtag }}";
    findhook_sendback['stack'] = hooks_clazz_Thread.currentThread().getStackTrace().slice(2,5).reverse().toString().replace(/,/g,"-lineline-");

    send(JSON.stringify(findhook_sendback, null, 4) + "-fi0n0dh0o0ok-");
    return findhook_retval;
};
