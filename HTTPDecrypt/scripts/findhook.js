// var findhook_retval = null;
// var findhook_sendback = {};
// var findhook_returntype = null;



function isObjC(p) {
    var klass = getObjCClassPtr(p);
    return !klass.isNull();
}


var ISA_MASK = ptr('0x0000000ffffffff8');
var ISA_MAGIC_MASK = ptr('0x000003f000000001');
var ISA_MAGIC_VALUE = ptr('0x000001a000000001');

function getObjCClassPtr(p) {
    /*
     * Loosely based on:
     * https://blog.timac.org/2016/1124-testing-if-an-arbitrary-pointer-is-a-valid-objective-c-object/
     */

    if (!isReadable(p)) {
        return NULL;
    }
    var isa = p.readPointer();
    var classP = isa;
    if (classP.and(ISA_MAGIC_MASK).equals(ISA_MAGIC_VALUE)) {
        classP = isa.and(ISA_MASK);
    }
    if (isReadable(classP)) {
        return classP;
    }
    return NULL;
}

function isReadable(p) {
    try {
        p.readU8();
        return true;
    } catch (e) {
        return false;
    }
}


setImmediate(function() {
	send("findhooks running..." + "-se00nood00tooag-");
	if (ObjC.available) {

		{{iosscript}}
	}else if(Java.available) {
	    Java.perform(function() {
	        var hooks_clazz_Thread = Java.use("java.lang.Thread");
       		{{scripts}}
   		});
	}

});