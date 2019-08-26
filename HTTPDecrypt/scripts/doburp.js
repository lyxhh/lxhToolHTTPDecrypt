var retval = null;
var sendback = {};
var recv_data = null;
var signature = "-to0obuooO0rp-";
var doburp_clazz_Thread = null;

function getCaller(){
	return doburp_clazz_Thread.currentThread().getStackTrace().slice(2,5).reverse().toString().replace(/,/g,"--->");
}

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
	send("doburp running..." + "-se00nood00tooag-");
	if (ObjC.available) {
		{{iosscript}}
	}else if(Java.available) {
	    Java.perform(function() {
       		{{scripts}}
   		});
	}
});


