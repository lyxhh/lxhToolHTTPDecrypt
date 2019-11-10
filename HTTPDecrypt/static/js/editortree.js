// var methodinfo = null;
// var Nativeinfo = null;

var setting = {
    view: {
		// fontCss : {color:"yellow"}
	},
	callback: {
		onClick: zTreeOnClick,
		onRightClick: OnRightClick
	}

};

function AutoMatch(txtObj) {
    if (txtObj.value.length > 0) {
        $.fn.zTree.init($("#javatree"), setting, AllNotes);
        fuzzySearch('javatree','#keyword',null,true); //初始化模糊搜索方法
    }else {
        $.fn.zTree.init($("#javatree"), setting, AllNotes);
    }
}



function OnRightClick(event, treeId, treeNode) {
	if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
		zTree.cancelSelectedNode();
	}else if("IOS" == treeNode.platform){
        zTree.selectNode(treeNode);
        $('#ios').menu('show', { left: event.pageX,
                                top:  event.pageY,
                                hideOnUnhover:false});

    }else if ("native" == treeNode.platform){
        zTree.selectNode(treeNode);
        $('#native').menu('show', { left: event.pageX,
                                top:  event.pageY,
                                hideOnUnhover:false});
    } else if (treeNode.NativeTag) {
	    zTree.selectNode(treeNode);
        $('#custom').menu('show', { left: event.pageX,
                                top:  event.pageY,
                                hideOnUnhover:false});
    } else if (treeNode && !treeNode.noparent && treeNode.isParent) {
		// console.log();
		zTree.selectNode(treeNode);
		$('#mm').menu('show', { left: event.pageX,
								top:  event.pageY,
								hideOnUnhover:false});

	}else if(treeNode.noparent){
		zTree.selectNode(treeNode);
		$('#mm1').menu('show', { left: event.pageX,
								top:  event.pageY,
								hideOnUnhover:false});
	}

    $('#mm').menu({

        onClick: function(item) {
            if (item.name == 'sendhooks') {
        	   sendhooks();
            } else if (item.name == 'modify' && !$('#modifyNode').attr('disabled')) {
                alert("修改节点");
            } else if (item.name == 'del' && !$('#delNode').attr('disabled')) {
         /*
         if (treeNode.children && treeNode.children.length > 0) {
          alert("该节点是父节点，还要继续删除么？");
         }*/
                alert("删除节点");
            }
        }
    });

    $('#mm1').menu({

        onClick: function(item) {
            if (item.name == 'SendtotoBurp') {
                sendtoburp();
            // alert("新增节点");
            // } else if (item.name == 'modify' && !$('#modifyNode').attr('disabled')) {
            //  alert("修改节点");
            // } else if (item.name == 'del' && !$('#delNode').attr('disabled')) {
             /*
             if (treeNode.children && treeNode.children.length > 0) {
              alert("该节点是父节点，还要继续删除么？");
             }*/

            }
        }
    });


    $('#ios').menu({

        onClick: function(item) {
            if (item.name == 'SendtotoBurp') {
                sendtoburp();
            }else if (item.name == 'sendhooks') {
                sendhooks();
            }
        }
    });
    
    $('#custom').menu({

        onClick: function(item) {
            // if (item.name == 'Generate hook script') {
                ghookscript();
            // }
        }
    });

    $('#native').menu({

        onClick: function(item) {
            if (item.name == 'enumerateExports') {
                enumerateMoudleByName('enumerateExports');
            }else if (item.name == 'enumerateRegisterNatives') {
                enumerateMoudleByName('enumerateRegisterNatives');
            }else if (item.name == 'enumerateImports') {
                enumerateMoudleByName('enumerateImports');
            }else if (item.name == 'enumerateSymbols') {
                enumerateMoudleByName('enumerateSymbols');
            }
        }
    });

}

function enumerateMoudleByName(type) {
    var modulename = zTree.getSelectedNodes()[0].modulename;
    socket.emit("enumerateMoudleByName", {"modulename": modulename,"type": type});
    // if ("enumerateExports" == type){
    //
    // } else if ("enumerateRegisterNatives" == type){
    //
    // } else if ("enumerateImports" == type){
    //
    // } else if ("enumerateSymbols" == type){
    //
    // }
}

function sendhooks() {
	var fullclazzname = zTree.getSelectedNodes()[0].fullclassname;
	var matchtext = Hooksinfo.getValue();
   if (matchtext){
   		Hooksinfo.setValue(matchtext + '\n' + fullclazzname);
    }else {
   		Hooksinfo.setValue(fullclazzname);
    }

}

function ghookscript() {
    alert("Features awaiting development, see next release.");
}

function sendtoburp() {
	var pkg_class_method = zTree.getSelectedNodes()[0].pkg_class_method;
	$('#InspectText').val(pkg_class_method);
}

function zTreeOnClick(event, treeId, treeNode) {
    var Nativeinfo = treeNode.NativeTag;
	var methodinfo = treeNode.methodinfo;
	var fullname = treeNode.fullname;
	if (methodinfo) {
        $("#findsmethodname").text(methodinfo);
		return ;
	}

	if (Nativeinfo && fullname != null){
	    $("#findsmethodname").text(fullname);
        return;
    } else if (Nativeinfo) {
        // $("#findsmethodname").text(Nativeinfo);
        var Nativesymbol = { Nativesymbol: Nativeinfo };
        socket.emit("Native2Sig", Nativesymbol);
		return ;
    }
    // alert(treeNode.name +','+ treeNode.methodname);
};


	var FindMatchcode = ace.edit("FindMatchcode");
    //设置编辑器样式，对应theme-*.js文件
    FindMatchcode.setTheme("ace/theme/twilight");
    //设置代码语言，对应mode-*.js文件
    // editor.session.setMode("ace/mode/javascript");
    //设置打印线是否显示
    FindMatchcode.setShowPrintMargin(false);
    //设置是否只读
    FindMatchcode.setReadOnly(false);

	var FindOptionscode = ace.edit("FindOptionscode");
    //设置编辑器样式，对应theme-*.js文件
    FindOptionscode.setTheme("ace/theme/twilight");
    FindOptionscode.setValue("{\"startsWith\":\"\"}\n{\"contains\":\"\"}\n{\"endsWith\":\"\"}");
    //设置代码语言，对应mode-*.js文件
    // editor.session.setMode("ace/mode/javascript");
    //设置打印线是否显示
    FindOptionscode.setShowPrintMargin(false);
    //设置是否只读
    FindOptionscode.setReadOnly(false);


	var toBurpinfo = ace.edit("infomessage");
    toBurpinfo.setTheme("ace/theme/twilight");
    toBurpinfo.setShowPrintMargin(false);
    toBurpinfo.setReadOnly(false);

	var Hooksinfo = ace.edit("HooksMatchcode");
    Hooksinfo.setTheme("ace/theme/twilight");
    Hooksinfo.setShowPrintMargin(false);
    Hooksinfo.setReadOnly(false);

	var HooksOptionscode = ace.edit("HooksOptionscode");
    HooksOptionscode.setTheme("ace/theme/twilight");
    HooksOptionscode.setValue("{\"startsWith\":\"\"}\n{\"contains\":\"\"}\n{\"endsWith\":\"\"}");
    HooksOptionscode.setShowPrintMargin(false);
    HooksOptionscode.setReadOnly(false);

	var DecoderLeft = ace.edit("DecoderLeft");
    DecoderLeft.setTheme("ace/theme/twilight");
    DecoderLeft.setShowPrintMargin(false);
    DecoderLeft.setReadOnly(false);
    DecoderLeft.setOption("wrap", "free");

	var DecoderRight = ace.edit("DecoderRight");
    DecoderRight.setTheme("ace/theme/twilight");
    DecoderRight.setShowPrintMargin(false);
    DecoderRight.setReadOnly(false);
    DecoderRight.setOption("wrap", "free");

    var dom = require("ace/lib/dom");

    //add command to all new editor instances
    require("ace/commands/default_commands").commands.push({
        name: "Toggle Fullscreen",
        bindKey: "F11",
        exec: function(Customcode) {
            var fullScreen = dom.toggleCssClass(document.body, "fullScreen");
            dom.setCssClass(Customcode.container, "fullScreen", fullScreen);
            Customcode.setAutoScrollEditorIntoView(!fullScreen);
            Customcode.resize()
        }
    });


    var Customcode = ace.edit("Customcode");
    Customcode.setTheme("ace/theme/twilight");
    Customcode.setShowPrintMargin(false);
    Customcode.setReadOnly(false);
    Customcode.setOption("wrap", "free");
    Customcode.session.setMode("ace/mode/javascript");
    Customcode.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });


    var ScriptManageEditorView = ace.edit("ScriptManageEditorView");
    ScriptManageEditorView.setTheme("ace/theme/twilight");
    ScriptManageEditorView.setShowPrintMargin(false);
    ScriptManageEditorView.setReadOnly(false);
    ScriptManageEditorView.setOption("wrap", "free");
    ScriptManageEditorView.session.setMode("ace/mode/javascript");
    ScriptManageEditorView.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    //以下部分是设置输入代码提示的，如果不需要可以不用引用ext-language_tools.js
   // ace.require("ace/ext/language_tools");
   // FindOptionscode.session.setMode("ace/mode/text");
   // FindOptionscode.setOptions({
   //      enableBasicAutocompletion: true,
   //      enableSnippets: true,
   //      enableLiveAutocompletion: true,
	// 	autoScrollEditorIntoView: true
   // });
// $("#Settinghook").bootstrapSwitch();
// $("#SettingExportInstance").bootstrapSwitch();
// $("#SettingExportstatic").bootstrapSwitch();
$("#Settingflag_sec").bootstrapSwitch();
$("#Settingssl_uncheck").bootstrapSwitch();
