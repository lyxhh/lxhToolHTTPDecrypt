var symbols = Module.enumerateSymbolsSync("libart.so");
var FindClass = null;
var addrRegisterNatives = null;
var ClassNames = {};

for (var i = 0; i < symbols.length; i++) {
	var symbol = symbols[i];
	
	if(FindClass != null && addrRegisterNatives != null){
		break;
	}
	
	if (symbol.name == "_ZN3art3JNI15RegisterNativesEP7_JNIEnvP7_jclassPK15JNINativeMethodi") {
		addrRegisterNatives = symbol.address;
		send("RegisterNatives addr is " + addrRegisterNatives + "-se00nood00tooag-");
	}else if(symbol.name == "_ZN3art3JNI9FindClassEP7_JNIEnvPKc"){
		FindClass = symbol.address;
		send("FindClass addr is " + FindClass + "-se00nood00tooag-");
	}
}

if (FindClass != null) {
	Interceptor.attach(FindClass, {
		onEnter: function (args) {
			if (args[1] != null) {
				//art::JNI::FindClass(_JNIEnv*, char const*)
				ClassNames[args[0]] = Memory.readCString(args[1]);
			}
		},
		onLeave: function (retval) { }
	});
}

if(addrRegisterNatives != null){
	Interceptor.attach(addrRegisterNatives, {
		onEnter: function(args) {
			//art::JNI::RegisterNatives(_JNIEnv*, _jclass*, JNINativeMethod const*, int)
			var methods_ptr = ptr(args[2]);
			var method_count = parseInt(args[3]);
			var sendModules = {};
			for (var i = 0; i < method_count; i++) {

				var name_ptr = Memory.readPointer(methods_ptr.add(i*12));
				var sig_ptr = Memory.readPointer(methods_ptr.add(i*12 + 4));
				var fnPtr_ptr = Memory.readPointer(methods_ptr.add(i*12 + 8));

				var name = Memory.readCString(name_ptr);
				send(name + "-se00nood00tooag-");

				var sig  = Memory.readCString(sig_ptr);
				var find_module = Process.findModuleByAddress(fnPtr_ptr);
				sendModules['exportname'] = name;
                sendModules['modulename'] = find_module.name;
                this.moudulename = find_module.name;
                sendModules['type'] = "RegisterNatives";
                sendModules['fullname'] = ClassNames[args[0]].replace(/\//g, '.') + "." + name + sig;
                send(JSON.stringify(sendModules) + "-natooiv00einoofo-");
			}
		},
		onLeave: function(retval) {
			send(this.moudulename + " Module RegisterNatives Enum done." + "-se00nood00tooag-");
		}
	});
}

