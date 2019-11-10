'use strict';

if (Java.available){
    var flagSecure = {{ flagSecure }};
    if (flagSecure) {
        send("load bypass flag secure." + "-se00nood00tooag-");
        bypass_flag_secure();
    }
}


rpc.exports = {
    enumallmoudle: function() {
        var sendModules = {};

        Process.enumerateModules({
            onMatch: function (module) { //枚举到一个模块的时候调用,根据包名以及后缀枚举，排除odex等后缀以及系统So.
                // console.log(module.name)
                if (Java.available) {
                    if (module.path.includes("{{pkgname}}") && module.path.endsWith(".so")) {
                        // console.log("module: " + module.name);
                        sendModules['modulename'] = module.name;
                        send("find " + module.name + " module." + "-se00nood00tooag-");
                        send(JSON.stringify(sendModules) + "-enuoom0N0a0ti0ve-");
                    }
                }else if (ObjC.available) {
                    sendModules['modulename'] = module.name;
                    send("find " + module.name + " module." + "-se00nood00tooag-");
                    send(JSON.stringify(sendModules) + "-enuoom0N0a0ti0ve-");
                }
            },
            onComplete: function () {
                send("{{pkgname}} All Module Enum done." + "-se00nood00tooag-");
            }
        });
    },

    enumerateexports: function(modulename){
        var sendModules = {};
        Module.enumerateExports(modulename, {
            onMatch: function(exports){
                send(exports.name + "-se00nood00tooag-");
                sendModules['exportname'] = exports.name;
                sendModules['modulename'] = modulename;
                sendModules['type'] = "exports";
                send(JSON.stringify(sendModules) + "-natooiv00einoofo-");

            },
            onComplete: function(){
                send(modulename + " Module Exports Enum done." + "-se00nood00tooag-");
            }
        });
    },

    enumerateimports: function(modulename){
        var sendModules = {};
        Module.enumerateImports(modulename, {
            onMatch: function(exports){
                send(exports.name + "-se00nood00tooag-");
                sendModules['exportname'] = exports.name + " - > "+exports.module;
                sendModules['modulename'] = modulename;
                sendModules['type'] = "imports";

                send(JSON.stringify(sendModules) + "-natooiv00einoofo-");

            },
            onComplete: function(){
                send(modulename + " Module Imports Enum done." + "-se00nood00tooag-");
            }
        });
    },

    enumeratesymbols: function(modulename){
        var sendModules = {};
        Module.enumerateSymbols(modulename, {
            onMatch: function(exports){
                // console.log( exports.name);
                send(exports.name + "-se00nood00tooag-");
                sendModules['exportname'] = exports.name;
                if (!(/^\$.?$/.test(exports.name))) {
                    sendModules['modulename'] = modulename;
                    sendModules['type'] = "symbols";
                    send(JSON.stringify(sendModules) + "-natooiv00einoofo-");
                }
            },
            onComplete: function(){
                send(modulename + " Module Symbols Enum done." + "-se00nood00tooag-");
            }
        });

    },
    screenshot: function () {
        if (Java.available) {
            send("-An0odr0ooidosc0reoen0sh0ot-")
        }else if (ObjC.available){
            iosscreenshot()
        }
    },
    downloadapp: function () {
        if (Java.available) {
            send("-do0wn0looadoApopo-")
        }else if (ObjC.available){
            send("-io0o0sdo0wn0looadoApopo-")
        }
    },
    uidump: function () {
        if (ObjC.available){
            try {
                 var ui = ObjC.classes.UIWindow.keyWindow().recursiveDescription().toString();
            } catch (e) {
                 var ui = 'Get UIWindow description Fail, Reason is ' + e;
            }
            send(ui + "-io0soui0du0mop-");
        }
    },
    queryuiaction: function(pointer){
		//http://172.16.200.11/SecurityService/fridadev/blob/master/js/ui.js
        if (ObjC.available){
            try {
                var view = new ObjC.Object(ptr(pointer));
  		        var allTargets = view.allTargets();
  		        var target = allTargets.allObjects().objectAtIndex_(0);
  		        var allControlEvents = view.allControlEvents();
  		        var action = view.actionsForTarget_forControlEvent_(target, allControlEvents);
                send("action-> " + action.objectAtIndex_(0).toString() + "-se00nood00tooag-");

            }catch (e) {
                // send(pointer +" not found action , Reason is: " + e + "-er00roo000r-");
                send(pointer +" not found action " + "-er00roo000r-");
            }
        }
    },
    queryuicontrol: function(pointer){
        if (ObjC.available) {
            try {
                var view = new ObjC.Object(ptr(pointer));
                var allTargets = view.allTargets();
                var count = allTargets.allObjects().count();
                for (var i = 0; i < count; i++) {
                    send("control-> " + allTargets.allObjects().objectAtIndex_(i).toString() + "-se00nood00tooag-");
                }
            } catch (e) {
                // send(pointer +" not found controller , Reason is: " + e + "-er00roo000r-");
                send(pointer +" not found controller " + "-er00roo000r-");
            }
        }
    }
};

function iosscreenshot() {
    //https://github.com/iddoeldor/frida-snippets#take-screenshot
    ObjC.schedule(ObjC.mainQueue, function() {
        var getNativeFunction = function (ex, retVal, args) {
            return new NativeFunction(Module.findExportByName('UIKit', ex), retVal, args);
        };
        var api = {
            UIWindow: ObjC.classes.UIWindow,
            UIGraphicsBeginImageContextWithOptions: getNativeFunction('UIGraphicsBeginImageContextWithOptions', 'void', [['double', 'double'], 'bool', 'double']),
            UIGraphicsBeginImageContextWithOptions: getNativeFunction('UIGraphicsBeginImageContextWithOptions', 'void', [['double', 'double'], 'bool', 'double']),
            UIGraphicsEndImageContext: getNativeFunction('UIGraphicsEndImageContext', 'void', []),
            UIGraphicsGetImageFromCurrentImageContext: getNativeFunction('UIGraphicsGetImageFromCurrentImageContext', 'pointer', []),
            UIImagePNGRepresentation: getNativeFunction('UIImagePNGRepresentation', 'pointer', ['pointer'])
        };
        var view = api.UIWindow.keyWindow();
        var bounds = view.bounds();
        var size = bounds[1];
        api.UIGraphicsBeginImageContextWithOptions(size, 0, 0);
        view.drawViewHierarchyInRect_afterScreenUpdates_(bounds, true);

        var image = api.UIGraphicsGetImageFromCurrentImageContext();
        api.UIGraphicsEndImageContext();

        var png = new ObjC.Object(api.UIImagePNGRepresentation(image));
        send('-i0oossoc0ree0ons0ohot-', Memory.readByteArray(png.bytes(), png.length()));
    });
}

function bypass_flag_secure() {
    // https://serializethoughts.com/2018/10/07/bypassing-android-flag_secure-using-frida
    Java.perform(function() {
        var surface_view = Java.use('android.view.SurfaceView');

        var set_secure = surface_view.setSecure.overload('boolean');

        set_secure.implementation = function(flag){
            // console.log("setSecure() flag called with args: " + flag);
            set_secure.call(false);
        };

        var window = Java.use('android.view.Window');
        var set_flags = window.setFlags.overload('int', 'int');

        var window_manager = Java.use('android.view.WindowManager');
        var layout_params = Java.use('android.view.WindowManager$LayoutParams');

        set_flags.implementation = function(flags, mask){
            //console.log(Object.getOwnPropertyNames(window.__proto__).join('\n'));
            // console.log("flag secure: " + layout_params.FLAG_SECURE.value);

            // console.log("before setflags called  flags:  "+ flags);
            flags =(flags.value & ~layout_params.FLAG_SECURE.value);
            send("set FLAG_SECURE: "+ flags + "-se00nood00tooag-");

            set_flags.call(this, flags, mask);
        };
    });
}



// function getScreenshot () {
//     var ActivityThread = Java.use('android.app.ActivityThread');
//     var Activity = Java.use('android.app.Activity');
//     var ActivityClientRecord = Java.use('android.app.ActivityThread$ActivityClientRecord');
//     var Bitmap = Java.use('android.graphics.Bitmap');
//     var ByteArrayOutputStream = Java.use('java.io.ByteArrayOutputStream');
//     var CompressFormat = Java.use('android.graphics.Bitmap$CompressFormat');
//     var activityThread = ActivityThread.currentActivityThread();
//     var activityRecords = activityThread.mActivities['value'].values().toArray();
//
//     var currentActivity;
//
//     for (var i in activityRecords) {
//
//         var activityRecord = Java.cast(activityRecords[i], ActivityClientRecord);
//
//         if (!activityRecord.paused['value']) {
//             currentActivity = Java.cast(Java.cast(activityRecord, ActivityClientRecord)
//                 .activity['value'], Activity);
//
//             break;
//         }
//     }
//
//     if (currentActivity) {
//         var view = currentActivity.getWindow().getDecorView().getRootView();
//         view.setDrawingCacheEnabled(true);
//         var bitmap = Bitmap.createBitmap(view.getDrawingCache());
//         view.setDrawingCacheEnabled(false);
//
//         var outputStream = ByteArrayOutputStream.$new();
//         bitmap.compress(CompressFormat.PNG['value'], 100, outputStream);
//         var bytes = outputStream.buf['value'];
//         // console.log(JSON.stringify(bytes));
//         send(JSON.stringify(bytes)+'-sc0rooe0eonsoh0ot-');
//     }
// }
//
// function test() {
//     var command = Java.use('java.lang.Process');
// var Runtime = Java.use('java.lang.Runtime');
// var InputStreamReader = Java.use('java.io.InputStreamReader');
// var BufferedReader = Java.use('java.io.BufferedReader');
// var StringBuilder = Java.use('java.lang.StringBuilder');
//     var javaString = Java.use('java.lang.String');
//     var ByteArrayOutputStream = Java.use('java.io.ByteArrayOutputStream');
//     var buffer = Java.use('java.io.BufferedInputStream');
//
// // Run the command
// command = Runtime.getRuntime().exec("su -c /system/bin/screencap -p",null,null);
// // command = Runtime.getRuntime().exec("ls -l",null,null);
//
//
// // var stdout_input_stream_reader = InputStreamReader.$new(command.getInputStream());
// // var buffered_reader = BufferedReader.$new(stdout_input_stream_reader);
// //
// // var stdout_string_builder = StringBuilder.$new();
// // var line_buffer = '';
// //
// // // while ((line_buffer = buffered_reader.readLine()) != null) {
// // //     stdout_string_builder.append(line_buffer + '\n');
// // // }
// // while ((line_buffer = buffered_reader.read()) != -1) {
// //     stdout_string_builder.append(line_buffer + '\n');
// // }
// // console.log(stdout_string_builder.toString() )
//
// // Read 'stdout'
// var buffers = buffer.$new(command.getInputStream(), 8192);
// var bytes = ByteArrayOutputStream.$new(8192);
// //
// // const temp = Java.array('byte', new Array(1024).fill(0));
// var arr = [];
// for (var i = 0; i < 8192; i++) {
//     arr[i] = 0;
// }
//
// var temp = Java.array('byte', arr );
// var size = 0;
// while ((size = buffers.read()) !=-1){
//     bytes.write(temp,0,size);
// }
// buffers.close();
// var a = bytes.toByteArray();
// console.log(a.length);
// send(JSON.stringify(a)+'-sc0rooe0eonsoh0ot-');
// // // var values = Java.array('byte', [100 * 1024] );
// // BufferedReader = BufferedReader.$new(stdout_input_stream_reader);
// // // const byteslen = Java.array('byte', new Array(1024).fill(0));
// // var byteArr = Java.use("[B"); // to declare the var in javascript
// //  // to instantiate the objec
// // // t
// // var buffersss = StringBuilder.$new(100 * 1024);
// // buffersss.setLength(0);
// // var line_buffer = 0;
// // // Java.array('[byte',[objectclass.class]);
// // while ((line_buffer = buffers.read(byteArr.$new(1024))) > 0) {
// //     var trmp = javaString.$new(values,0,line_buffer,"ISO-8859-1");
// //     console.log(trmp);
// //     buffersss.append(trmp);
// //     // stdout_string_builder.append(trmp + '\n');
// //
// // }
// // buffera.close();
// // command.waitFor();
// // var temp  = buffersss.toString().getBytes("ISO-8859-1");
// // console.log(JSON.stringify(temp));
// }