var methodinfo = null;
var Nativeinfo = null;

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

    }else if (treeNode && !treeNode.noparent && treeNode.isParent) {
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

function sendtoburp() {
	var pkg_class_method = zTree.getSelectedNodes()[0].pkg_class_method;
	$('#InspectText').val(pkg_class_method);
}

function zTreeOnClick(event, treeId, treeNode) {
    Nativeinfo = treeNode.NativeTag;
	methodinfo = treeNode.methodinfo;
	if (methodinfo) {
        $("#findsmethodname").text(methodinfo);
		return ;
	}
	if (Nativeinfo) {
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
    HooksOptionscode.setShowPrintMargin(false);
    HooksOptionscode.setReadOnly(false);

	var DecoderLeft = ace.edit("DecoderLeft");
    DecoderLeft.setTheme("ace/theme/twilight");
    DecoderLeft.setShowPrintMargin(false);
    DecoderLeft.setReadOnly(false);
    DecoderLeft.setOption("wrap", "free")

	var DecoderRight = ace.edit("DecoderRight");
    DecoderRight.setTheme("ace/theme/twilight");
    DecoderRight.setShowPrintMargin(false);
    DecoderRight.setReadOnly(false);
    DecoderRight.setOption("wrap", "free")

    //以下部分是设置输入代码提示的，如果不需要可以不用引用ext-language_tools.js
   // ace.require("ace/ext/language_tools");
   // FindOptionscode.session.setMode("ace/mode/text");
   // FindOptionscode.setOptions({
   //      enableBasicAutocompletion: true,
   //      enableSnippets: true,
   //      enableLiveAutocompletion: true,
	// 	autoScrollEditorIntoView: true
   // });
