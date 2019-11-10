# - * - coding:utf-8 - * -
from globalenv import socketio, genv
import frida
import jinja2
from util import *
import os
import random


@socketio.on('loadInspect', namespace='/defchishi')
def load_inspect(message):
    InspectTextval = message.get('InspectText')

    if InspectTextval is not None:
        pos = InspectTextval.rfind('.')
        if -1 != pos:
            # Android
            className = InspectTextval[:pos]
            methodNmae = InspectTextval[pos+1:]
            content = {
                'clazz_name': className,
                'method_name': methodNmae
            }
        else:
            # IOS
            content = {
                'clazz_name': InspectTextval,
            }
        script_content = render('./scripts/inspect.js', content)
        # print(script_content)
        loadScript(script_content)


@socketio.on('clear_hookMessage', namespace='/defchishi')
def clear_hook_message():
    logger.info("ClearMessage")


@socketio.on('downloadApp', namespace='/defchishi')
def download_app():
    logger.info("download App ing...")
    content = {
        'pkgname': genv.get_pkgname(),
        'flagSecure': 0
    }
    script_content = render('./scripts/index.js', content)
    try:
        getattr(genv.script.exports, "downloadapp")()
    except Exception as e:
        # logger.info("screenshot Error Reason is %s." % e)
        flag = loadScript(script_content)
        if flag != "no":
            getattr(genv.script.exports, "downloadapp")()


@socketio.on('screenshot', namespace='/defchishi')
def screenshot(message):
    flag_sec = message.get("flag_sec")
    flag = 1 if flag_sec else 0
    content = {
        'pkgname': genv.get_pkgname(),
        'flagSecure': flag
    }
    script_content = render('./scripts/index.js', content)
    # print(script_content)
    try:
        getattr(genv.script.exports, "screenshot")()
    except Exception as e:
        # logger.info("screenshot Error Reason is %s." % e)
        returnflag = sleep_load_scipt(script_content) if flag else loadScript(script_content)
        if returnflag != "no":
            getattr(genv.script.exports, "screenshot")()


@socketio.on('loaduiScript', namespace='/defchishi')
def load_ui_script():
    logger.info("load ui script...")
    content = {}
    script_content = render('./scripts/ui.js', content)
    # print(script_content)
    loadScript(script_content)


@socketio.on('queryui', namespace='/defchishi')
def query_ui(message):
    logger.info("query ui by ptr.")
    ptr = message.get("ptr")

    content = {
        'pkgname': genv.get_pkgname(),
        'flagSecure': 0
    }
    script_content = render('./scripts/index.js', content)
    try:
        logger.info("query action.")
        getattr(genv.script.exports, "queryuiaction")(ptr)
        logger.info("query control.")
        getattr(genv.script.exports, "queryuicontrol")(ptr)
        logger.info("done.")
    except Exception as e:
        # logger.info("screenshot Error Reason is %s." % e)
        flag = loadScript(script_content)
        if flag != "no":
            getattr(genv.script.exports, "queryuiaction")(ptr)
            getattr(genv.script.exports, "queryuicontrol")(ptr)
    # print(type(ptr), ptr)
    # content = {}
    # script_content = render('./scripts/ui.js', content)
    # print(script_content)
    # loadScript(script_content)


@socketio.on('iosuidump', namespace='/defchishi')
def ios_ui_dump():
    content = {
        'pkgname': genv.get_pkgname(),
        'flagSecure': 0
    }
    script_content = render('./scripts/index.js', content)
    try:
        getattr(genv.script.exports, "uidump")()
    except Exception as e:
        # logger.info("screenshot Error Reason is %s." % e)
        flag = loadScript(script_content)
        if flag != "no":
            getattr(genv.script.exports, "uidump")()


@socketio.on('ExportAllMoudle', namespace='/defchishi')
def export_all_moudle():
    logger.info("ExportAllMoudle")
    content = {
                'pkgname': genv.get_pkgname(),
                'flagSecure': 0
                # 'type': "EnumExportNative"
               }
    script_content = render('./scripts/index.js', content)
    # print(script_content)
    flag = loadScript(script_content)
    if flag != "no":
        getattr(genv.script.exports, "enumallmoudle")()


@socketio.on('enumerateMoudleByName', namespace='/defchishi')
def enumerate_moudle_by_name(message):
    modulename = message.get("modulename")
    type = message.get("type")
    logger.info(type + " " + modulename)
    content = {
        'pkgname': genv.get_pkgname(),
        'flagSecure': 0
        # 'type': "EnumExportNative"
    }
    script_content = render('./scripts/index.js', content)
    try:
        if "enumerateExports" == type:
            getattr(genv.script.exports, "enumerateexports")(modulename)
        elif "enumerateImports" == type:
            getattr(genv.script.exports, "enumerateimports")(modulename)
        elif "enumerateSymbols" == type:
            getattr(genv.script.exports, "enumeratesymbols")(modulename)
        elif "enumerateRegisterNatives" == type:
            if genv.isAndroid is not None and genv.isAndroid:
                content = render('./scripts/enumerateNativeMethods.js', content)
                sleep_load_scipt(content)
            else:
                logger.warning("enumerateRegisterNatives Only supports Android.")
    except Exception as e:
        logger.info("Error Reason is %s." % e)
        flag = loadScript(script_content)
        if flag != "no":
            if "enumerateExports" == type:
                getattr(genv.script.exports, "enumerateexports")(modulename)
            elif "enumerateImports" == type:
                getattr(genv.script.exports, "enumerateimports")(modulename)
            elif "enumerateSymbols" == type:
                getattr(genv.script.exports, "enumeratesymbols")(modulename)
            elif "enumerateRegisterNatives" == type:
                content = render('./scripts/enumerateNativeMethods.js', content)
                sleep_load_scipt(content)


@socketio.on('unloadfindclassScript', namespace='/defchishi')
def unload_find_class_script():
    logger.info("unload_findclass_script")
    genv.script.unload()


@socketio.on('setpkgname', namespace='/defchishi')
def set_package_name(message):
    pkgname = message.get('pkgnameText')
    logger.info("setPackageName: %s" % pkgname)

    genv.set_pkgname(pkgname)
    pkgarr = {'result': pkgname}
    get_application()
    socketio.emit('setpkgNameResult', pkgarr, namespace='/defchishi')


@socketio.on('detachall', namespace='/defchishi')
def detachall():
    logger.info("Clear all inserted scripts")
    try:
        if genv.session is not None:
            genv.session.detach()
        else:
            logger.warning("No scripts can be unloaded.")
    except Exception as e:
        logger.error("detach all Fail, Reason is {}.".format(e))


@socketio.on('SettingloadScript', namespace='/defchishi')
def setting_load_script(message):
    logger.info("setting load script")
    try:
        setting_hook = message.get("Settinghook")
        setting_exp_instance = message.get("SettingExportInstance")
        setting_exp_static = message.get("SettingExportstatic")
        methods_lists = message.get("methods_list")
        if not len(methods_lists.get("methods_list")):
            logger.error("toBurp info is empty, please check..")
            return
        methods_list = methods_lists.get("methods_list")

        if setting_hook:
            pass

        if setting_exp_instance:
            pass

        if setting_exp_static:
            pass

        # print(type(Settinghook),Settinghook)
        # pass
    except Exception as e:
        logger.error("detach all Fail, Reason is {}.".format(e))


@socketio.on('loadCustomScript', namespace='/defchishi')
def load_custom_script(message):
    logger.info("custom script running...")
    ScriptContent = message.get('ScriptContent')
    type = message.get('type')
    try:
        if type == "normal":
            loadScript(ScriptContent)
        elif type == "sleep":
            sleep_load_scipt(ScriptContent)
        else:
            logger.error("Only normal and sleep loading scripts are supported")
    except Exception as e:
        logger.error("loadCustomScript Error, Reason is {}".format(e))


@socketio.on('Native2Sig', namespace='/defchishi')
def native_to_sig(message):
    Nativesymbol = message.get('Nativesymbol')
    try:
        status, valus = subprocess.getstatusoutput('c++filt %s' % Nativesymbol)
    except Exception as e:
        logger.error("native_to_sig error, Reason is {}".format(e))
        status = 1
    CSig = valus if(0 == status) else Nativesymbol
    CSigarr = {'CSig': CSig}
    socketio.emit('CSig', CSigarr, namespace='/defchishi')


@socketio.on('connect', namespace='/defchishi')
def get_application():
    try:
        rdev = genv.get_device()
        if rdev is None:
            return

        lists = []
        genv.isAndroid = isAndroid(rdev)

        for i in rdev.enumerate_applications():
            dictitem = {'pkgname': i.identifier, 'name': i.name, 'pid': i.pid}
            genv.allApp[i.identifier] = i.name
            lists.append(dictitem)
        # print(lists)
        apparr = {'result': lists}
        socketio.emit('getapp', apparr, namespace='/defchishi')
    except frida.ServerNotRunningError as e:
        # logger.error(e)
        logger.error("frida-server No Running or port no forward....please check.")
    except frida.TransportError as e:
        logger.error("with frida_server connection is closed")
    except Exception as e:
        logger.error("connect error, {}".format(e))


@socketio.on('getFileContentByFileName', namespace='/defchishi')
def get_file_content_by_filename(message):
    # print(message.get('filename'))
    filename = message.get('filename')
    try:
        with open(filename, encoding='utf-8') as f:
            filecontent = f.read()
        socketio.emit('OutputFileContent', {"filecontent": filecontent}, namespace='/defchishi')
    except Exception as e:
        logger.error("get file content fail, Reason is {}".format(e))


@socketio.on('deletefile', namespace='/defchishi')
def delete_file(message):
    # print(message.get('filename'))
    try:
        filepath = message.get('filepath')
        os.remove(filepath)
        logger.info("delete file {}".format(filepath))
    except Exception as e:
        logger.error("delete file fail, Reason is {}".format(e))


@socketio.on('savefileContent', namespace='/defchishi')
def save_file_content(message):
    filepath = message.get('filepath')
    filecontent = message.get('filecontent')
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(filecontent)
    except Exception as e:
        logger.error("Failed to change file {}, reason: {}.".format(filepath, e))
    else:
        logger.info("Changed file {} successfully.".format(filepath))


@socketio.on('saveScript', namespace='/defchishi')
def save_script(message):
    script_content = message.get('ScriptContent')
    filename = message.get('filename')
    pkgname = genv.get_pkgname()
    if pkgname is not None:
        dir_name = '{}\\scripts\\custom\\{}'.format(dirname(abspath(__file__)), pkgname.replace('.', '_'))
        fullfilename = "{}\\{}.js".format(dir_name, filename)
        # logger.info(dir_name)
        # logger.info(fullfilename)
        if not os.path.exists(dir_name):
            os.mkdir(dir_name)

        if not os.path.exists(fullfilename):
            with open(fullfilename, 'w', encoding='utf-8') as f:
                f.write(script_content)
        else:
            tempfilename = filename + time.strftime('_%Y%m%d%H%M%S', time.localtime(time.time()))
            logger.warning("{}.js File already exists, Save as {}.js".format(filename, tempfilename))
            fullfilename = "{}\\{}.js".format(dir_name, tempfilename)
            with open(fullfilename, 'w', encoding='utf-8') as f:
                f.write(script_content)
        logger.info("Save as {}".format(fullfilename))
    else:
        logger.info("Identifier is null, please input.")
        return


@socketio.on('getcustominfo', namespace='/defchishi')
def get_custom_info():
    packageName = genv.get_pkgname()
    if packageName is None:
        customdir = '{}\\scripts\\custom\\'.format(os.path.dirname(os.path.abspath(__file__)))
    else:
        customdir = '{}\\scripts\\custom\\{}'.format(os.path.dirname(os.path.abspath(__file__)), packageName.replace('.', '_'))
    commondir = '{}\\scripts\\common\\'.format(os.path.dirname(os.path.abspath(__file__)))
    # allfile = os.listdir(customdir)
    httpout = ''
    for dirpath in [customdir, commondir]:
        for root, dirs, files in os.walk(dirpath):
            for file in files:
                newfile = os.path.join(root, file)
                httpout += """
                       <button onclick="getFileContentByFileName('{}')" type="button" class="list-group-item">{}</button>""".format(
                    newfile.replace('\\', '/'), file)

    socketio.emit('getCustomScriptList', {'data': httpout}, namespace='/defchishi')


@socketio.on('doburp', namespace='/defchishi')
def doburp(message):
    script_content = ""
    methods_list = message.get('methods_list')
    doburp_type = message.get('type')

    if "Android" == doburp_type:
        for item in methods_list:
            temptime = random.random()
            classname = item.get('classname')
            methodname = item.get('methodname')
            index = item.get('index')
            methodtag = item.get('methodtag')
            # print(type(index))

            context = {
                'clazz_var': classname.replace('.', '')+ hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'clazz_name': classname,
                'method_var': methodtag + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'method_name': methodname,
                'index_var': "index" + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'index': index,
            }
            script_content += render('./scripts/doburp_template.js', context)
            script_content += "\n// Added doburp \n\t"
            # print(script_content)
        content = {'scripts': script_content, "iosscript":""}

    elif "IOS" == doburp_type:
        for item in methods_list:
            # temptime = random.random()
            classname = item.get('classname')
            methodname = item.get('methodname')
            # index = item.get('index')
            methodtag = item.get('methodtag')
            # print(type(index))

            context = {
                'clazz_name': classname,
                'methodtag': methodtag,
                'method_name': methodname,
            }
            script_content += render('./scripts/doburp_iostemplate.js', context)
            script_content += "\n// Added doburp \n\t"
            script_content += render('./scripts/doburp_iosChangeRetvalTemplate.js', context)
            script_content += "\n// Added doburp \n\t"
            # print(script_content)
        content = {'scripts': "", "iosscript":script_content}
    else:
        logger.error("GeneratetoBurp Error, Only supports Android and IOS platforms. Please check.")
        return
    result = render('./scripts/doburp.js', content)
    # print(result)
    loadScript(result)


@socketio.on('GeneratetoBurp', namespace='/defchishi')
def generate_to_burp(message):
    script_content = ""
    methods_list = message.get('methods_list')
    doburp_type = message.get('type')

    if "Android" == doburp_type:
        for item in methods_list:
            temptime = random.random()
            classname = item.get('classname')
            methodname = item.get('methodname')
            index = item.get('index')
            methodtag = item.get('methodtag')
            # print(type(index))

            context = {
                'clazz_var': classname.replace('.', '') + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'clazz_name': classname,
                'method_var': methodtag + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'method_name': methodname,
                'index_var': "index" + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'index': index,
            }
            script_content += render('./scripts/doburp_template.js', context)
            script_content += "\n// Added doburp \n\t"
            # print(script_content)
        content = {'scripts': script_content, "iosscript":""}

    elif "IOS" == doburp_type:
        for item in methods_list:
            # temptime = random.random()
            classname = item.get('classname')
            methodname = item.get('methodname')
            # index = item.get('index')
            methodtag = item.get('methodtag')
            # print(type(index))

            context = {
                'clazz_name': classname,
                'methodtag': methodtag,
                'method_name': methodname,
            }
            script_content += render('./scripts/doburp_iostemplate.js', context)
            script_content += "\n// Added doburp \n\t"
            script_content += render('./scripts/doburp_iosChangeRetvalTemplate.js', context)
            script_content += "\n// Added doburp \n\t"
            # print(script_content)
        content = {'scripts': "", "iosscript":script_content}
    else:
        logger.error("GeneratetoBurp Error, Only supports Android and IOS platforms. Please check.")
        return

    result = render('./scripts/doburp.js', content)
    # print(result)
    socketio.emit('OutputGenerateExportScript', {"filecontent": result}, namespace='/defchishi')
    logger.info("GenerateToBurpScript done, result in Custom Tag.")
    # loadScript(result)


def render(tpl_path, context={}):
    path, filename = os.path.split(tpl_path)
    return jinja2.Environment(
        loader=jinja2.FileSystemLoader(path or './')
    ).get_template(filename).render(context)


@socketio.on('rpcExportInstance', namespace='/defchishi')
def export_rpc_instance(message):
    script_content = ""
    iosscript_content = ""
    methods_list = message.get('methods_list')
    # print(methods_list)
    for item in methods_list:
        if "" == item:
            continue
        temptime = random.random()
        platform = item.get('platform')
        if "IOS" == platform:
            classname = item.get('classname')
            methodname = item.get('methodname')
            methodtag = item.get('methodtag')
            length = item.get('length')
            logger.info(classname + "[" + methodname + "]" + " length: " + str(length) + "-> " + methodtag)

            args = ""

            for i in range(length):
                args += "arg" + str(i) if 0 == i else ", " + "arg" + str(i)

            context = {
                'clazz_name': classname,
                'method_name': methodname,
                'method_var': methodtag,
                'clazz_var': classname + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'args': args
            }
            iosscript_content += render('./scripts/Export_iosTemplate_Instance.js', context)
            iosscript_content += "\n// Added Hook \n\t"
        else:
            classname = item.get('classname')
            methodname = item.get('methodname')
            length = item.get('length')
            methodtag = item.get('methodtag')
            logger.info(classname + "." + methodname + " length: " + str(length) + "-> " + methodtag)
            # print(methodtag)
            args = ""
            for i in range(length):
                args += "arg" + str(i) if 0 == i else ", " + "arg" + str(i)

            context = {
                'clazz_var': classname.split('.')[-1] + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'clazz_name': classname,
                'method_var': methodtag,
                'method_name': methodname,
                'args': args
            }
            script_content += render('./scripts/Export_Template_Instance.js', context)
            script_content += "\n// Added Function \n\t"
    # print(script_content)
    content = {'scripts': script_content, 'iosscript': iosscript_content}
    result = render('./scripts/Export.js', content)
    # print(result)
    loadScript(result)


@socketio.on('rpcExport', namespace='/defchishi')
def export_rpc_static(message):
    script_content = ""
    iosscript_content = ""
    methods_list = message.get('methods_list')
    # print(methods_list)
    for item in methods_list:
        if "" == item:
            continue
        platform = item.get('platform')
        temptime = random.random()
        if "IOS" == platform:
            classname = item.get('classname')
            methodname = item.get('methodname')
            methodtag = item.get('methodtag')
            length = item.get('length')
            logger.info(classname + "[" + methodname + "]" + " length: " + str(length) + "-> " + methodtag)

            args = ""

            for i in range(length):
                args += "arg" + str(i) if 0 == i else ", " + "arg" + str(i)

            context = {
                'clazz_name': classname,
                'method_name': methodname,
                'method_var': methodtag,
                'clazz_var': classname + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'args': args
            }
            iosscript_content += render('./scripts/Export_iosTemplate.js', context)
            iosscript_content += "\n// Added Hook \n\t"
        elif "Android" == platform:
            classname = item.get('classname')
            methodname = item.get('methodname')
            length = item.get('length')
            methodtag = item.get('methodtag')
            logger.info(classname + "." + methodname + " length: " +str(length) + "-> " + methodtag)
            # print(methodtag)
            args = ""
            for i in range(length):
                args += "arg" + str(i) if 0 == i else ", " + "arg" + str(i)

            context = {
                'clazz_var': classname.split('.')[-1] + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'clazz_name': classname,
                'method_var': methodtag,
                'method_name': methodname,
                'args': args
            }
            script_content += render('./scripts/Export_Template.js', context)
            script_content += "\n// Added Function \n\t"
        else:
            logger.error("exportrpc Error, Only supports Android and ios platforms. Please check")
            return
    # print(script_content)
    content = {'scripts': script_content, 'iosscript': iosscript_content}
    result = render('./scripts/Export.js', content)
    # print(result)
    loadScript(result)


@socketio.on('GenerateExportInstance', namespace='/defchishi')
def generate_export_instance(message):
    script_content = ""
    iosscript_content = ""
    methods_list = message.get('methods_list')
    # print(methods_list)
    for item in methods_list:
        if "" == item:
            continue
        temptime = random.random()
        platform = item.get('platform')
        if "IOS" == platform:
            classname = item.get('classname')
            methodname = item.get('methodname')
            methodtag = item.get('methodtag')
            length = item.get('length')
            logger.info(classname + "[" + methodname + "]" + " length: " + str(length) + "-> " + methodtag)

            args = ""

            for i in range(length):
                args += "arg" + str(i) if 0 == i else ", " + "arg" + str(i)

            context = {
                'clazz_name': classname,
                'method_name': methodname,
                'method_var': methodtag,
                'clazz_var': classname + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'args': args
            }
            iosscript_content += render('./scripts/Export_iosTemplate_Instance.js', context)
            iosscript_content += "\n// Added Hook \n"
        elif "Android" == platform:
            classname = item.get('classname')
            methodname = item.get('methodname')
            length = item.get('length')
            methodtag = item.get('methodtag')
            logger.info(classname + "." + methodname + " length: " + str(length) + "-> " + methodtag)
            # print(methodtag)
            args = ""
            for i in range(length):
                args += "arg" + str(i) if 0 == i else ", " + "arg" + str(i)

            context = {
                'clazz_var': classname.split('.')[-1] + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'clazz_name': classname,
                'method_var': methodtag,
                'method_name': methodname,
                'args': args
            }
            script_content += render('./scripts/Export_Template_Instance.js', context)
            script_content += "\n// Added Function \n"
        else:
            logger.error("GenerateExportInstance Error, Only supports Android and ios platforms. Please check")
            return
    # print(script_content)
    content = {'scripts': script_content, 'iosscript': iosscript_content}
    result = render('./scripts/Export.js', content)
    socketio.emit('OutputGenerateExportScript', {"filecontent": result}, namespace='/defchishi')
    logger.info("GenerateExportScript done, result in Custom Tag.")
    # print(result)


@socketio.on('GenerateExportStatic', namespace='/defchishi')
def generate_export_static(message):
    script_content = ""
    iosscript_content = ""
    methods_list = message.get('methods_list')

    for item in methods_list:
        if "" == item:
            continue
        platform = item.get('platform')
        temptime = random.random()
        if "IOS" == platform:
            classname = item.get('classname')
            methodname = item.get('methodname')
            methodtag = item.get('methodtag')
            length = item.get('length')
            logger.info(classname + "[" + methodname + "]" + " length: " + str(length) + "-> " + methodtag)

            args = ""

            for i in range(length):
                args += "arg" + str(i) if 0 == i else ", " + "arg" + str(i)

            context = {
                'clazz_name': classname,
                'method_name': methodname,
                'method_var': methodtag,
                'clazz_var': classname + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'args': args
            }
            iosscript_content += render('./scripts/Export_iosTemplate.js', context)
            iosscript_content += "\n// Added Hook \n"
        elif "Android" == platform:
            classname = item.get('classname')
            methodname = item.get('methodname')
            length = item.get('length')
            methodtag = item.get('methodtag')
            logger.info(classname + "." + methodname + " length: " +str(length) + "-> " + methodtag)
            # print(methodtag)
            args = ""
            for i in range(length):
                args += "arg" + str(i) if 0 == i else ", " + "arg" + str(i)

            context = {
                'clazz_var': classname.split('.')[-1] + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'clazz_name': classname,
                'method_var': methodtag,
                'method_name': methodname,
                'args': args
            }
            script_content += render('./scripts/Export_Template.js', context)
            script_content += "\n// Added Function \n"
        else:
            logger.error("exportrpc Error, Only supports Android and ios platforms. Please check")
            return
    content = {'scripts': script_content, 'iosscript': iosscript_content}
    result = render('./scripts/Export.js', content)

    socketio.emit('OutputGenerateExportScript', {"filecontent": result}, namespace='/defchishi')
    logger.info("GenerateExportStaticScript done, result in Custom Tag.")
    # print(result)


@socketio.on('findhook', namespace='/defchishi')
def find_hook(message):
    script_content = ""
    iosscript_content = ""
    methods_list = message.get('methods_list')
    
    for item in methods_list:
        if "" == item:
            continue
        # print(item)
        platform = item.get('platform')

        if "IOS" == platform:
            classname = item.get('classname')
            methodname = item.get('methodname')
            methodtag = item.get('methodtag')
            context = {
                'clazz_name': classname,
                'method_name': methodname,
                'methodtag': methodtag
            }
            iosscript_content += render('./scripts/findhook_iostemplate.js', context)
            iosscript_content += "\n// Added Hook \n"
        elif "Android" == platform:
            # for item in methods_list:
            temptime = random.random()
            classname = item.get('classname')
            methodname = item.get('methodname')
            index = item.get('index')
            methodtag = item.get('methodtag')
            # print(type(index))
            """ 确保承接重载函数的变量不一致，否则将报错，ex. var a = java.use("aaa.bbb") a 不能重复. """
            context = {
                'clazz_var': classname.replace('.', '')+ hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'clazz_name': classname,
                'method_var': methodtag + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'method_name': methodname,
                'index_var': "index" + hashlib.md5(str(temptime).encode(encoding='UTF-8')).hexdigest(),
                'index': index,
                'methodtag': methodtag
            }
            script_content += render('./scripts/findhook_template.js', context)
            script_content += "\n// Added Hook \n"
        else:
            logger.error("findhook Error, Only supports Android and ios platforms. Please check")
        # print(script_content)
    content = {'scripts': script_content, 'iosscript': iosscript_content}
    result = render('./scripts/findhook.js', content)
    # print(result)
    loadScript(result)


@socketio.on('loadHookScript', namespace='/defchishi')
def do_load_hook(message):
    hooks_list = message.get('hooks_list')
    matchtext = hooks_list.get('matchtext')
    hookOptions_lists = message.get('hookOptions_lists')
    hookOptions_list = hookOptions_lists.get('hookOptions_list')
    # print(matchtext)
    # print(hookOptions_list)

    options = ""
    for item in hookOptions_list:
        for key, values in item.items():
            if "startsWith" == key and "" != values:
                options += "&& !className.startsWith(\"%s\") " % values
            elif "contains" == key and "" != values:
                options += "&& -1 == className.indexOf(\"%s\")  " % values
            elif "endsWith" == key and "" != values:
                options += "&& !className.endsWith(\"%s\") " % values
            else:
                """如果key不是这三个，则跳过，排除乱七八糟的key"""
                continue

    # options = ""
    #
    # for item in hookOptions_list:
    #     options += "!methodName.startsWith(\"%s\") " % item if "" == options else "&& !methodName.startsWith(\"%s\") " % item

    logger.info("HooksMatch: %s, Options: %s" % (matchtext, options))
    content = {
        'hookslist': matchtext,
        'options': options
    }
    # if "" == options:
    #     content = {
    #         'hookslist': matchtext,
    #         'options': "methodName.startsWith(\"\")",
    #     }
    # else:
    #     content = {
    #         'hookslist': matchtext,
    #         'options': options,
    #     }
    script_content = render('./scripts/hooks.js', content)
    # print(script_content)
    loadScript(script_content)


@socketio.on('loadfindclassScript',namespace='/defchishi')
def do_find_class(message):
    type = message.get('type')

    finds_list = message.get('finds_list')
    matchfindtext = finds_list.get("find_list")

    findOptions_lists = message.get('findOptions_lists')
    findOptions_list = findOptions_lists.get("findOptions_list")

    # print(findOptions_list)
    options = ""
    for item in findOptions_list:
        for key, values in item.items():
            if "startsWith" == key and "" != values:
                options += "&& !className.startsWith(\"%s\") " % values
            elif "contains" == key and "" != values:
                options += "&& -1 == className.indexOf(\"%s\")  " % values
            elif "endsWith" == key and "" != values:
                options += "&& !className.endsWith(\"%s\") " % values
            else:
                """如果key不是这三个，则跳过，排除乱七八糟的key"""
                continue
    # print(options)
    # print(matchfindtext)
    if "searchmethod" == type:
        logger.info("searchstring: %s, Options: %s" % (matchfindtext, options))
        content = {
                    'find_list': matchfindtext,
                    'options': options,
                   }
        script_content = render('./scripts/findmethods.js', content)
    elif "findclass" == type:
        logger.info("FindMatch: %s, Options: %s" % (matchfindtext, options))
        content = {
            'matchfindtext': matchfindtext,
            'options': options,
        }
        script_content = render('./scripts/finds.js', content)
    else:
        logger.error("find type Error")
        return

    # print(script_content)
    loadScript(script_content)

