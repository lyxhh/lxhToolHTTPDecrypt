var matchtext = null;

var findOptionscode = null;
var findmatchdata = null;
var Hooksinfodata = null;
var hooksOptionscode = null;

var pkgnameText = null;
var zTree = null;
var findhookmessage  = null;
var namespace = "/defchishi";
var crypto_count = 0;
var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);
socket.emit('connect', function() {
    console.log("socket connect ok!");
});


function bytesToHex(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function hexToBytes(hexString) {
  var result = [];
  for (var i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substr(i, 2), 16));
  }
  return result;
}

function uniqBy(arr) {
  var seen = {};
  return arr.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}


function clear_hookMessage() {
    $("#outputBody").empty();
    // console.log("clear_hookMessage");
    socket.emit("clear_hookMessage");
}

function clear_findMessage() {
    // $("#javatree").empty();
    $.fn.zTree.destroy("javatree");
    // console.log("clear_hookMessage");
    socket.emit("clear_hookMessage");
}

function clear_stackMessage() {
    $("#stackoutputBody").empty();
    // console.log("clear_hookMessage");
    socket.emit("clear_hookMessage");
}

function clear_CryptoMessage() {
    $("#CryptooutputBody").empty();
    // console.log("clear_hookMessage");
    socket.emit("clear_hookMessage");
}
function clear_doburp_hookMessage() {
    $("#toburpoutputBody").empty();
    // console.log("clear_hookMessage");
    socket.emit("clear_hookMessage");
}

function detachall() {
    socket.emit("detachall");
}


function doburp() {
    var lists = toBurpinfo.getValue().split('\n');
    var methods_list = { methods_list: [] };
    for (var index = 0; index < lists.length; index++) {
        try {
            if ("" == lists[index]){
                continue;
            }
            var temp = JSON.parse(lists[index]);
            methods_list.methods_list.push(temp)
        } catch (e) {
            console.log("findhook is error: " + lists[index])
        }
    }
    socket.emit("doburp", methods_list);

}

function unloadScript() {
	socket.emit("unloadfindclassScript");
}

function findhook(){
    var lists = toBurpinfo.getValue().split('\n');

    var methods_list = { methods_list: [] };
    for (var index = 0; index < lists.length; index++) {
        try {
            if ("" == lists[index]){
                continue;
            }
            var temp = JSON.parse(lists[index]);
            methods_list.methods_list.push(temp)
        } catch (e) {
            console.log("findhook is error: " + lists[index])
        }
    }
    socket.emit("findhook", methods_list);
}

function addinfo(){
    var select_result = $("#select_result option:selected").val();
    var select_text = $("#select_result option:selected").text();
    var pkg_class_method_name_code =  $("#pkg_class_method_name_code").text();
    var jsoninfo = JSON.parse(pkg_class_method_name_code);
    var jmethodname = jsoninfo.methodname;
    var methodarglength = JSON.parse(select_text).length;
    // console.log(select_result + "::::"+select_text+":::"+methodarglength);
    // var methodtag = jmethodname + jsoninfo.classtag + select_result + methodarglength;
    var methodtag = "tag" + jsoninfo.classtag + select_result + methodarglength;
    // console.log(jsoninfo);

    var val = toBurpinfo.getValue();
    var hook_message = { "classname": jsoninfo.classname, "methodname": jmethodname, "index": Number(select_result), "length":methodarglength, "methodtag": methodtag};
    if (val){
        toBurpinfo.setValue(val + '\n' + JSON.stringify(hook_message));
    }else {
        toBurpinfo.setValue(JSON.stringify(hook_message))
    }

}

function rpcExport(){
    var lists = toBurpinfo.getValue().split('\n');
    lists = uniqBy(lists);

    var methods_list = { methods_list: [] };
    for (var index = 0; index < lists.length; index++) {
        try {
            if ("" == lists[index]){
                continue;
            }
            var temp = JSON.parse(lists[index]);
            methods_list.methods_list.push(temp)
        } catch (e) {
            console.log("rpcExport is error: " + lists[index])
        }
    }
    socket.emit("rpcExport", methods_list);
}

function rpcExportInstance(){
    var lists = toBurpinfo.getValue().split('\n');
    lists = uniqBy(lists);

    var methods_list = { methods_list: [] };
    for (var index = 0; index < lists.length; index++) {
        try {
            if ("" == lists[index]){
                continue;
            }
            var temp = JSON.parse(lists[index]);
            methods_list.methods_list.push(temp)
        } catch (e) {
            console.log("rpcExportInstance is error: " + lists[index])
        }
    }
    socket.emit("rpcExportInstance", methods_list);
}


// function call(){
//     var data = $("#findhookmessage").val();
//     var script_to_load = { data: data };
//     socket.emit("call", script_to_load);
// }


window.onload = function() {

    $("#loadScript").click(function(){
        // matchtext = $("#matchtext").val();
        Hooksinfodata = Hooksinfo.getValue().split('\n');
        // console.log(Hooksinfodata);
        // Hooksinfodata = uniqBy(Hooksinfodata);
        // console.log(Hooksinfodata);
        var hooks_list = { matchtext: [] };
        for (var index = 0; index < Hooksinfodata.length; index++) {
            try {
                var hook_val = Hooksinfodata[index].trim();
                hooks_list.matchtext.push(hook_val);

            } catch (e) {
                console.log("Hooksinfodata error: " + Hooksinfodata[index])
            }
        }

        hooksOptionscode = HooksOptionscode.getValue().split('\n');
        hooksOptionscode = uniqBy(hooksOptionscode);

        var hookOptions_lists = { hookOptions_list: [] };
        for (var index = 0; index < hooksOptionscode.length; index++) {
            try {
                    if ("" == hooksOptionscode[index]){
                        //去除空行。
                        continue;
                    }
                    var hookOptions = hooksOptionscode[index].trim();
                    hookOptions_lists.hookOptions_list.push( hookOptions);

            } catch (e) {
                console.log("findOptions error No Json: " + hooksOptionscode[index])
            }
        }

        var script_to_load = { "hooks_list": hooks_list, "hookOptions_lists":hookOptions_lists};
        // console.log(script_to_load);
        socket.emit("loadHookScript", script_to_load);
    });


    $("#loadfindScript").click(function(){
	    $.fn.zTree.init($("#javatree"), setting, null);
	    zTree = $.fn.zTree.getZTreeObj("javatree");
        findmatchdata = FindMatchcode.getValue().split('\n');
        // findmatchdata = uniqBy(findmatchdata);

        var finds_list = { find_list: [] };
        for (var index = 0; index < findmatchdata.length; index++) {
            try {
                var find_val = findmatchdata[index].trim();
                finds_list.find_list.push(find_val);

            } catch (e) {
                console.log("findmatchdata error: " + findmatchdata[index])
            }
        }

        findOptionscode = FindOptionscode.getValue().split('\n');
        findOptionscode = uniqBy(findOptionscode);

        var findOptions_lists = { findOptions_list: [] };
        for (var index = 0; index < findOptionscode.length; index++) {
            try {
                    if ("" == findOptionscode[index]){
                        //去除空行。
                        continue;
                    }
                    var findOptions = JSON.parse(findOptionscode[index]);
                    findOptions_lists.findOptions_list.push( findOptions);

            } catch (e) {
                console.log("findOptions error No Json: " + findOptionscode[index])
            }
        }

        // var script_to_load = { "matchfindtext": matchfindtext, "startsWithText":startsWithText, "containsText":containsText, "endsWithText":endsWithText};
        var script_to_load = { "finds_list": finds_list, "findOptions_lists":findOptions_lists};
        socket.emit("loadfindclassScript", script_to_load);
    });

    $("#loadCryptoScript").click(function(){
        // matchfindtext = $("#matchfindtext").val();
        // var script_to_load = { matchfindtext: matchfindtext };

        socket.emit("loadCryptoScript");
    });

    $("#DecoderConfirmLeft").click(function(){
        var Decoderselected = $("#Decoder_select_result option:selected").val();
        var DecoderLeftvalues = DecoderLeft.getValue().trim();
        // console.log(DecoderLeftvalues);
        if ("1" == Decoderselected){
            DecoderRight.setValue(bytesToHex(DecoderLeftvalues.split(',')));
        }else if ("2" == Decoderselected){
            let bytes = new Uint8Array(DecoderLeftvalues.split(','));
            let str = new TextDecoder().decode(bytes);
            // console.log(bytes);
            DecoderRight.setValue(str);
        }
        // console.log(Decoderselected);
    });

    $("#DecoderConfirmRight").click(function(){
        var Decoderselected = $("#Decoder_select_result option:selected").val();
        var DecoderRightvalues = DecoderRight.getValue().trim();
        // console.log(DecoderRightvalues);
        if ("1" == Decoderselected){
            DecoderLeft.setValue(hexToBytes(DecoderRightvalues).toString());

        }else if ("2" == Decoderselected){
            let bytes = new TextEncoder().encode(DecoderRightvalues);
            DecoderLeft.setValue(bytes.toString());
        }
    });

    $("#Inspect").click(function(){
        var InspectText = $("#InspectText").val().trim();
        if(InspectText){
            var InspectText_load = { InspectText: InspectText };
            socket.emit("loadInspect", InspectText_load);
            // console.log(InspectText);
        }else{
            alert("Invalid Input, not empty.")
        }

    });

    $("#pkgname").click(function(){
        pkgnameText = $("#pkgnametext").val();
        if(pkgnameText){
            var pkgnameText_load = { pkgnameText: pkgnameText };
            socket.emit("setpkgname", pkgnameText_load);
            // console.log(pkgnameText);
        }else{
            alert("Invalid Input, not empty.")
        }

    });

    $("#toggle_find_info").click(function(e) {
        var link = $(this);
        $("#find-info-div").slideToggle('slow', function() {
            if ($(this).is(':visible')) {
                link.html('Finds <i class="glyphicon glyphicon-resize-small"></i>');
            } else {
                link.html('Finds <i class="glyphicon glyphicon-resize-full"></i>');
            }
        });
    });

    $("#toggle_toburp_info").click(function(e) {
        var link = $(this);
        $("#toburp-info-div").slideToggle('slow', function() {
            if ($(this).is(':visible')) {
                link.html('toBurp <i class="glyphicon glyphicon-resize-small"></i>');
            } else {
                link.html('toBurp <i class="glyphicon glyphicon-resize-full"></i>');
            }
        });
    });

    $("#toggle_hooks_info").click(function(e) {
        var link = $(this);
        $("#hooks-info-div").slideToggle('slow', function() {
            if ($(this).is(':visible')) {
                link.html('Hooks <i class="glyphicon glyphicon-resize-small"></i>');
            } else {
                link.html('Hooks <i class="glyphicon glyphicon-resize-full"></i>');
            }
        });
    });


    socket.on('new_hook_message', function(msg) {
        var jdata = JSON.parse(msg.data);
        // var hook_message = jdata.get("")
        var args = jdata.args;
        var methodname = jdata.methodname;
        var retval = jdata.retval;
        var stackname = jdata.stacklist;
       // alert($('#outputBody').html());
        $('#outputBody').append('<tr><td>' + methodname + '</td><td><code>' + args + '</code></td><td>' + retval + '</td></tr>');
        $('#stackoutputBody').append('<tr><td>' + methodname + '</td><td><code>' + stackname + '</code></td></tr>');
        // console.log(jdata);
        // alert(jdata);
    });


    socket.on('find_message', function(msg) {
        var f_data = JSON.parse(msg.data);
        // console.log(f_data);
        var classico = null;
        var methodico = null;
        var treeObj = null;
        var node = null;
        var nodeinfo = null;
        var classNode = null;
        var methodNode = null;
        var fullclassname = null;
        var pkg_class_method = null;
        var classAccesspermissions = f_data.Accesspermissions;
        var pkgname = f_data.pkgname;
        var classname = f_data.classname;
        var methodinfo = f_data.methodinfo;
        var methodname = f_data.methodname;
        // console.log("method"+methodname);
        var fullclassname = f_data.fullclassname;
        var pkg_class_method = fullclassname + '.'+methodname.split('(')[0];
        // console.log("123"+class_method);
        treeObj = $.fn.zTree.getZTreeObj("javatree");
        var pkgnodes = treeObj.getNodesByParam("name", pkgname, null);
        var classnodes = treeObj.getNodesByParam("name", classname, null);

        if (classAccesspermissions.includes("interface")) {
            classico = "/static/images/int_obj.png"
        } else if (classAccesspermissions.includes("enum")){
            classico = "/static/images/enum_obj.png"
        } else if (classAccesspermissions.includes("annotation")){
            classico = "/static/images/annotation_obj.png"
        }else if (classAccesspermissions.includes("private")) {
             classico = "/static/images/innerclass_private_obj.png"
        }else if (classAccesspermissions.includes("protected")) {
             classico = "/static/images/innerclass_protected_obj.png"
        }else{
            classico = "/static/images/class_default_obj.png"
        }

        if (methodinfo.includes("public")) {
            methodico = "/static/images/methpub_obj.png"
        } else if (methodinfo.includes("private")) {
            methodico = "/static/images/methpri_obj.png"
        } else if (methodinfo.includes("protected")) {
            methodico = "/static/images/methpro_obj.png"
        } else{
            methodico = "/static/images/methdef_obj.png"
        }
        

        if (0 != pkgnodes.length) {
            if (0 != classnodes.length){
                node = treeObj.getNodeByParam("name", classname, null);
                // if (methodname.includes("interface")) {
                //     methodNode = {name: methodinfo};
                // }else if (){
                //
                // }
                methodNode = {name: methodname, icon:methodico, "methodinfo":methodinfo, "pkg_class_method":pkg_class_method, noparent:true};
                treeObj.addNodes(node, methodNode);

            }else {
                node = treeObj.getNodeByParam("name", pkgname, null);
                classNode = {name: classname,icon: classico, fullclassname: fullclassname};
                treeObj.addNodes(node, classNode);
                node = treeObj.getNodeByParam("name", classname, null);
                methodNode = {name: methodname, icon:methodico, "methodinfo":methodinfo, "pkg_class_method":pkg_class_method, noparent:true};
                treeObj.addNodes(node, methodNode);

            }
        }else{
            // console.log(pkgname);
	        nodeinfo = {name: pkgname, icon:"/static/images/package_obj.png", fullclassname: pkgname};
	        treeObj.addNodes(null, nodeinfo);

	        node = treeObj.getNodeByParam("name", pkgname, null);
	        classNode = {name:classname,icon: classico, fullclassname: fullclassname};
	        treeObj.addNodes(node, classNode);

            node = treeObj.getNodeByParam("name", classname, null);
	        methodNode = {name: methodname, icon:methodico, "methodinfo":methodinfo, "pkg_class_method":pkg_class_method, noparent:true};
	        treeObj.addNodes(node, methodNode);

        }

    });



    // socket.on('Crypto_message', function(msg) {
    //     crypto_count += 1;
    //     var f_data = JSON.parse(msg.data);
    //     var type = f_data.type;
    //     //var hashcode = f_data.hashcode;
    //     var key = f_data.key;
    //     var Iv = f_data.IV;
    //     var transformation = f_data.transformation;
    //     var before_do = f_data.before_doFinal;
    //     var after_do = f_data.after_doFinal;
    //
    //    // alert($('#outputBody').html());
    //     $('#CryptooutputBody').append('<tr><td>' + crypto_count + '</td><td>'+
    //         "type: "+"<code>"+type+"</code>"+
    //         //", hashcode: "+hashcode+
    //         ", key: "+"<code>" +key +
    //         "</code>"+", iv: "+"<code>" + Iv + "</code>"+
    //         "</code>"+", transformation: "+"<code>" + transformation + "</code>"+
    //         ", before_doFinal: "+"<code>"+before_do+"</code>"+
    //         ", after_doFinal: "+"<code>"+after_do+"</code>"+
    //         '</td></tr>');
    //     // $('#stackoutputBody').append('<tr><td>' + methodname + '</td><td><code>' + stackname + '</code></td></tr>');
    //     // console.log(jdata);
    //     // alert(jdata);
    // });


    // socket.on('temp', function(msg) {
    //     var jdata = JSON.parse(msg.data);
    //     // var hook_message = jdata.get("")
    //     var stackname = jdata.method;
    //     var methodname = jdata.methodname;
    //     // var retval = jdata.retval;
    //    // alert($('#outputBody').html());
    //     $('#stackoutputBody').append('<tr><td>' + methodname + '</td><td><code>' + stackname + '</code></td></tr>');
    //     // console.log(jdata);
    //     // alert(jdata);
    // });

    socket.on('input_result', function(msg) {
        // var jresult= msg.result;
        // console.log(jresult);
        $("#input_reuslt").html(msg.result);
    });


    socket.on('findhook_message', function(msg) {
        var dict1 = {};
        var arginfo = {};
        // var key = null;
        var f_data = JSON.parse(msg.data);
        for (var key in f_data.Args) {
            arginfo['arg' + key] = '<code>' + f_data.Args[key] + '</code>';
            // console.log("arg" + key + " : " + f_data.Args[key]);
        }
        dict1['Methodinfo'] = "<code>"+f_data.Methodinfo + "</code>";
        dict1['Args'] =  arginfo;
        // dict1['Args'] =  JSON.stringify( f_data.Args);

        dict1['Retval'] = "<code>" + f_data.Retval + "</code>";

        // console.log(msg.data);
        // console.log(f_data);

        $('#toburpoutputBody').append('<tr><td>' + JSON.stringify(dict1) + '</td><td><form action="/call" method="POST" target="_blank"><input type="hidden" name="methodtag"  value="' + f_data.methodtag + '" />'+"<input type='hidden' name='argsinfo'  value='" + JSON.stringify(f_data.Args) + "' />"+'<button type="submit"  class="btn btn-default " style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;">call</button></form></td></tr>');


    });


    socket.on('setpkgNameResult', function(msg) {
        // var jresult= msg.result;
        // console.log(jresult);
        $("#pkg").text(msg.result);
    });

    socket.on('getapp', function(msg) {
        console.log("[INFO] Load ApplicationList");
        $('#outputappname').html('');
        var arr = msg.result;
        for (var i = 0;i < arr.length;i++){
            var jsondata = arr[i];
            // console.log(jsondata);

            $('#outputappname').append('<tr><td>' + jsondata.pkgname + '</td><td><code>' + jsondata.name + '</code></td><td>' + jsondata.pid + '</td></tr>');
        }

    });
};
