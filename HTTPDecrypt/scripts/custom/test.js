Interceptor.attach(Module.findExportByName(null, 'dlopen'), {
    onEnter: function(args) {
        this.path = Memory.readUtf8String(args[0]);
        console.log(this.path);
    },
    onLeave: function(retval) {
        if (!retval.isNull() && this.path.indexOf('libnative2.so') !== -1 && !didHookApis) {
            didHookApis = true;
            console.log("File loaded hooking");
            hooknative2();
            // ...
        }
    }
});