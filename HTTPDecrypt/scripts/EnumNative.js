function enumrateMoudles(){
    Process.enumerateModules({
        onMatch: function(module){ //枚举到一个模块的时候调用,根据包名以及后缀枚举，排除odex等后缀以及系统So.
            if(module.path.includes("{{pkgname}}") &&  module.path.endsWith(".so")){
                console.log("module: " + module.name);
                if ("{{type}}" == "EnumExportNative") {
                     enumerateExports(module.name);
                }else if ("{{type}}" == "EnumImportNative"){
                    enumerateImports(module.name);
                }else if ("{{type}}" == "EnumSymbols") {
                    enumerateSymbols(module.name);
                }

            }
        },
        onComplete: function(){
            send("Native All Module Enum done." + "-se00nood00tooag-");
        }
    });
}

function enumerateExports(modulename){
    var sendModules = {};
    Module.enumerateExports(modulename, {
        onMatch: function(exports){
            sendModules['exportname'] = exports.name;
            sendModules['modulename'] = modulename;

            send(JSON.stringify(sendModules) + "-enuoom0N0a0ti0ve-");

        },
        onComplete: function(){
            send(modulename + " Module Exports Enum done." + "-se00nood00tooag-");
        }
    });
}

function enumerateImports(modulename){
    var sendModules = {};
    Module.enumerateImports(modulename, {
        onMatch: function(exports){
            sendModules['exportname'] = exports.name + " - > "+exports.module;
            sendModules['modulename'] = modulename;

            send(JSON.stringify(sendModules) + "-enuoom0N0a0ti0ve-");

        },
        onComplete: function(){
            send(modulename + " Module Imports Enum done." + "-se00nood00tooag-");
        }
    });
}

function enumerateSymbols(modulename){
    var sendModules = {};
    Module.enumerateSymbols("libart.so", {
        onMatch: function(exports){
            console.log( exports.name);
            sendModules['exportname'] = exports.name;
            sendModules['modulename'] = modulename;

            send(JSON.stringify(sendModules) + "-enuoom0N0a0ti0ve-");

        },
        onComplete: function(){
            send(modulename + " Module Symbols Enum done." + "-se00nood00tooag-");
        }
    });

}


setImmediate(function() {
    Java.perform(function() {
        send("enum native running..." + "-se00nood00tooag-");

        enumrateMoudles();
    });
});