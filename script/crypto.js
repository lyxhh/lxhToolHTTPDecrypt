var signature = '-CrOOooyp00to-';
var iv_parameter_spec = null;

function arrayTohex(data) {
    var hexstr = "";
    for (i = 0;i < data.length; i++) {
        var b = (data[i] >>> 0) & 0xff;
        var n = b.toString(16);
        hexstr += ("00" + n).slice(-2)+"";
    }
    return hexstr;
}

function hook() {
    var cipher = Java.use("javax.crypto.Cipher");
    var targetMethod = "init";
    var overloadCount = cipher[targetMethod].overloads.length;
    var List_hook = null;
    for (var i = 0;i < overloadCount;i++){
		List_hook  = eval('cipher[targetMethod].overloads[i]');
		List_hook.implementation = function() {
            var argstype = [];
            var sb = {};
			for (var index = 0; index < arguments.length; index++) {
                argstype.push(this.argumentTypes[index]["className"]);
			}
            (arguments[0] == 1) ? sb['type'] = "encrypt":sb['type'] = "decrypt";
            ("java.security.Key" == argstype[1]) ? sb['key'] = arrayTohex(arguments[1].getEncoded()):sb['key'] = arrayTohex(arguments[1].getPublicKey());
            ("java.security.SecureRandom" == argstype[2]) ? sb['IV'] = 'random': sb['IV'] =  arrayTohex(Java.cast(arguments[2], iv_parameter_spec).getIV());
            // sb['random'] = '未实现';
			// var retval =

			return this[targetMethod].apply(this, arguments);
		}
	}

}




function hookcrypto(){
    /*
    var sb = null;
    // classSecretKeySpec = Java.use("javax.crypto.spec.SecretKeySpec");
    // var overloadz_class_hook = eval("classSecretKeySpec[$init].overloads[0]");

    */

    var sb = {};
    var cipher = Java.use("javax.crypto.Cipher");
    var Base64 = Java.use("android.util.Base64");
    iv_parameter_spec = Java.use("javax.crypto.spec.IvParameterSpec");
    /*
    cipher.getInstance.overload("java.lang.String").implementation = function(x1){
        sb['transformation'] = x1;
        // console.log(x1);
        return this.getInstance(x1);
    };
    */
    var targetMethod = "init";
    var overloadCount = eval(cipher[targetMethod].overloads.length);
    // console.log(overloadCount);
    var List_hook = null;
    for (var i = 0;i < overloadCount;i++){
		List_hook  = eval('cipher[targetMethod].overloads[i]');
		// console.log("1");
		List_hook.implementation = function() {
            var argstype = [];
            //var sb = {};
            for (var index = 0; index < arguments.length; index++) {
                argstype.push(List_hook.argumentTypes[index]["className"]);
                console.log(List_hook.argumentTypes[index]["className"]);
            }
            (arguments[0] == 1) ? sb['type'] = "encrypt":sb['type'] = "decrypt";
            // ("java.security.Key" == argstype[1]) ? sb['key'] = arrayTohex(arguments[1].getEncoded()):sb['key'] = "no rsa";
            sb['key'] = arrayTohex(arguments[1].getEncoded());
            sb['IV']  = "no iv";
            if (arguments.length >2) {
                // ("java.security.SecureRandom" == argstype[2]) ? sb['IV'] = 'random' : sb['IV'] = arrayTohex(Java.cast(arguments[2], iv_parameter_spec).getIV());
                sb['IV'] = arrayTohex(Java.cast(arguments[2], iv_parameter_spec).getIV());

            }
			return this[targetMethod].apply(this, arguments);
		};
        cipher.getInstance.overload("java.lang.String").implementation = function(x1){
        sb['transformation'] = x1;
        // console.log(x1);
        return this.getInstance(x1);
    };

		    cipher.doFinal.overload("[B").implementation = function (x) {
        var ret = cipher.doFinal.overload("[B").call(this, x);
        if("encrypt" == sb['type']){
            sb['before_doFinal'] = arrayTohex(x);
            sb['after_doFinal'] = Base64.encodeToString(ret,0);

        }else {
            sb['before_doFinal'] = Base64.encodeToString(x,0);
            sb['after_doFinal'] = arrayTohex(ret);
        }
        send(JSON.stringify(sb) + signature);
        return ret;

    };
	}
    /*
    cipher.doFinal.overload("[B").implementation = function (x) {
        var ret = cipher.doFinal.overload("[B").call(this, x);
        if("encrypt" == sb['type']){
            sb['before_doFinal'] = arrayTohex(x);
            sb['after_doFinal'] = Base64.encodeToString(ret,0);

        }else {
            sb['before_doFinal'] = Base64.encodeToString(x,0);
            sb['after_doFinal'] = arrayTohex(ret);
        }
        send(JSON.stringify(sb) + signature);
        return ret;

    };
    */
       /*
        if (arguments[0] == 1){ // 1 means Cipher.MODE_ENCRYPT
            sb['type'] = "encrypt";
            sb['hashcode'] = this.hashCode();
            sb['key'] = arrayTohex(arguments[1].getEncoded());
            sb['IV'] =  arrayTohex(Java.cast(arguments[2], iv_parameter_spec).getIV());
        } else {
            sb['type'] = "decrypt";
            sb['hashcode'] = this.hashCode();
            sb['key'] = arrayTohex(y.getEncoded());
            sb['IV'] =  arrayTohex(Java.cast(z, iv_parameter_spec).getIV());
        }
        */
        // return cipher.init.overload("int", "java.security.Key", "java.security.spec.AlgorithmParameterSpec").call(this, x, y, z);

    // };



}

setTimeout(function() {
    Java.perform(function() {
		hookcrypto();
    });
}, 0);