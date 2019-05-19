# - * - coding:utf-8 - * -
from globalenv import socketio
import frida
import jinja2
from util import *
import os
import random


@socketio.on('loadInspect',namespace='/defchishi')
def loadInspect(message):
    InspectTextval = message.get('InspectText')
    # app.logger.debug(InspectTextval)
    if InspectTextval != None:
        pos = InspectTextval.rfind('.')
        className = InspectTextval[:pos]
        methodNmae = InspectTextval[pos+1:]
        with open("./script/inspect.js", 'r', encoding="utf-8") as f:
            script_content = f.read() % (className+'-wh00ooer00e-'+methodNmae)
        loadScript(script_content)


@socketio.on('clear_hookMessage',namespace='/defchishi')
def clear_hookMessage():
    logger.info("clear_hookMessage")


@socketio.on('unloadfindclassScript',namespace='/defchishi')
def unloadfindclassScript():
    logger.info("unload_findclass_script")
    genv.script.unload()


@socketio.on('setpkgname',namespace='/defchishi')
def setpkgName(message):
    pkgname = message.get('pkgnameText')
    logger.info("setPackageName: %s" % pkgname)

    genv.set_pkgname(pkgname)
    pkgarr = {'result': pkgname}
    getApplication()
    socketio.emit('setpkgNameResult', pkgarr, namespace='/defchishi')


@socketio.on('detachall',namespace='/defchishi')
def setpkgName():
    logger.info("Clear all inserted scripts")
    genv.session.detach()


@socketio.on('connect',namespace='/defchishi')
def getApplication():
    try:
        rdev = genv.get_device()
        lists = []
        for i in rdev.enumerate_applications():
            dictitem = {'pkgname': i.identifier,'name':i.name,'pid':i.pid}
            lists.append(dictitem)
        # print(lists)
        apparr = {'result':lists}
        socketio.emit('getapp',apparr, namespace='/defchishi')
    except frida.ServerNotRunningError as e:
        # apparr = {'result': "Waiting for device connect..."}
        # socketio.emit('getapp',apparr, namespace='/defchishi')
        logger.error("frida-server No Running or port no forward....please check.")
        # print(colored("[ERROR] frida-server No Running or port no forward....please check.", "red"))
    except frida.TransportError as e:
        logger.error("with frida_server connection is closed")
        # print(colored("[ERROR] with frida_server connection is closed", "red"))

        # print(colored("[INFO] PackagaName is null, please input.", "red"))


@socketio.on('doburp',namespace='/defchishi')
def doburp(message):
    script_content = ""
    methods_list = message.get('methods_list')
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
            # 'methodtag': methodtag
        }
        script_content += render('./script/doburp_template.js', context)
        script_content += "\n// Added doburp \n"
        # print(script_content)
    content = {'scripts': script_content}
    result = render('./script/doburp.js', content)
    # print(result)
    loadScript(result)


def render(tpl_path, context):
    path, filename = os.path.split(tpl_path)
    return jinja2.Environment(
        loader=jinja2.FileSystemLoader(path or './')
    ).get_template(filename).render(context)


@socketio.on('rpcExportInstance', namespace='/defchishi')
def exportrpc(message):
    script_content = ""
    methods_list = message.get('methods_list')
    # print(methods_list)
    for item in methods_list:
        if "" == item:
            continue
        temptime = random.random()
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
        script_content += render('./script/Export_Template_Instance.js', context)
        script_content += "\n// Added Function \n"
    # print(script_content)
    content = {'scripts': script_content}
    result = render('./script/Export.js', content)
    # print(result)
    loadScript(result)


@socketio.on('rpcExport', namespace='/defchishi')
def exportrpc(message):
    script_content = ""
    methods_list = message.get('methods_list')
    # print(methods_list)
    for item in methods_list:
        if "" == item:
            continue
        temptime = random.random()
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
        script_content += render('./script/Export_Template.js', context)
        script_content += "\n// Added Function \n"
    # print(script_content)
    content = {'scripts': script_content}
    result = render('./script/Export.js', content)
    # print(result)
    loadScript(result)


@socketio.on('findhook', namespace='/defchishi')
def findhook(message):
    script_content = ""
    methods_list = message.get('methods_list')
    for item in methods_list:
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
        script_content += render('./script/findhook_template.js', context)
        script_content += "\n// Added Hook \n"
        # print(script_content)
    content = {'scripts': script_content}
    result = render('./script/findhook.js', content)
    # print(result)
    loadScript(result)


@socketio.on('loadHookScript',namespace='/defchishi')
def doLoadHook(message):
    hooks_list = message.get('hooks_list')
    matchtext = hooks_list.get('matchtext')
    hookOptions_lists = message.get('hookOptions_lists')
    hookOptions_list = hookOptions_lists.get('hookOptions_list')
    # print(matchtext)
    # print(hookOptions_list)

    options = ""
    for item in hookOptions_list:
        options += "!targetClassMethod.startsWith(\"%s\") " % item if "" == options else "&& !targetClassMethod.startsWith(\"%s\") " % item

    logger.info("HooksMatch: %s, Options: %s" % (matchtext, options))
    if "" == options:
        content = {
            'hookslist': matchtext,
            'options': "targetClassMethod.startsWith(\"\")",
        }
    else:
        content = {
            'hookslist': matchtext,
            'options': options,
        }
    script_content = render('./script/hooks.js', content)
    # print(script_content)
    loadScript(script_content)


@socketio.on('loadfindclassScript',namespace='/defchishi')
def dofindclass(message):
    finds_list = message.get('finds_list')
    matchfindtext = finds_list.get("find_list")

    findOptions_lists = message.get('findOptions_lists')
    findOptions_list = findOptions_lists.get("findOptions_list")

    # print(findOptions_list)
    options = ""
    for item in findOptions_list:
        for key, values in item.items():
            if "startsWith" == key and "" != values:
                options += "&& !aClass.startsWith(\"%s\") " % values
            elif "contains" == key and "" != values:
                options += "&& -1 == aClass.indexOf(\"%s\")  " % values
            elif "endsWith" == key and "" != values:
                options += "&& !aClass.endsWith(\"%s\") " % values
            else:
                """如果key不是这三个，则跳过，排除乱七八糟的key"""
                continue
    # print(options)
    # print(matchfindtext)

    logger.info("FindMatch: %s, Options: %s" % (matchfindtext, options))
    content = {
                'matchfindtext': matchfindtext,
                'options': options,
               }
    script_content = render('./script/finds.js', content)
    # print(script_content)
    loadScript(script_content)

