# - * - coding:utf-8 - * -
from globalenv import socketio, genv
import frida
import jinja2
from util import *
import os
import random


@socketio.on('loadInspect', namespace='/defchishi')
def loadInspect(message):
    InspectTextval = message.get('InspectText')

    if InspectTextval != None:
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
def clear_hookMessage():
    logger.info("ClearHookMessage")


@socketio.on('loadEnumExportNativeScript', namespace='/defchishi')
def loadEnumExportNativeScript():
    logger.info("loadEnumExportNativeScript")
    content = {
                'pkgname': genv.get_pkgname(),
                'type': "EnumExportNative"
               }
    script_content = render('./scripts/EnumNative.js', content)
    # print(script_content)
    loadScript(script_content)


@socketio.on('loadEnumImportNativeScript', namespace='/defchishi')
def loadEnumImportNativeScript():
    logger.info("loadEnumImportNativeScript")
    content = {
                'pkgname': genv.get_pkgname(),
                'type': "EnumImportNative"
               }
    script_content = render('./scripts/EnumNative.js', content)
    # print(script_content)
    loadScript(script_content)


@socketio.on('loadEnumSymbolsScript', namespace='/defchishi')
def loadEnumSymbolsScript():
    logger.info("loadEnumSymbolsScript")
    content = {
                'pkgname': genv.get_pkgname(),
                'type': "EnumSymbols"
               }
    script_content = render('./scripts/EnumNative.js', content)
    # print(script_content)
    loadScript(script_content)


@socketio.on('unloadfindclassScript', namespace='/defchishi')
def unloadfindclassScript():
    logger.info("unload_findclass_script")
    genv.script.unload()


@socketio.on('setpkgname', namespace='/defchishi')
def setpkgName(message):
    pkgname = message.get('pkgnameText')
    logger.info("setPackageName: %s" % pkgname)

    genv.set_pkgname(pkgname)
    pkgarr = {'result': pkgname}
    getApplication()
    socketio.emit('setpkgNameResult', pkgarr, namespace='/defchishi')


@socketio.on('detachall', namespace='/defchishi')
def setpkgName():
    logger.info("Clear all inserted scripts")
    genv.session.detach()

@socketio.on('Native2Sig', namespace='/defchishi')
def Native2Sig(message):
    Nativesymbol = message.get('Nativesymbol')

    status, valus = subprocess.getstatusoutput('c++filt %s' % Nativesymbol)
    CSig = valus if(0 == status ) else Nativesymbol
    CSigarr = {'CSig': CSig}
    socketio.emit('CSig', CSigarr, namespace='/defchishi')


@socketio.on('connect', namespace='/defchishi')
def getApplication():
    try:
        rdev = genv.get_device()
        lists = []
        for i in rdev.enumerate_applications():
            dictitem = {'pkgname': i.identifier, 'name': i.name, 'pid': i.pid}
            lists.append(dictitem)
        # print(lists)
        apparr = {'result':lists}
        socketio.emit('getapp',apparr, namespace='/defchishi')
    except frida.ServerNotRunningError as e:
        logger.error("frida-server No Running or port no forward....please check.")
    except frida.TransportError as e:
        logger.error("with frida_server connection is closed")


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
            script_content += "\n// Added doburp \n"
            # print(script_content)
        content = {'scripts': script_content, "iosscript":""}

    elif "IOSChangeArgs" == doburp_type:
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
            script_content += "\n// Added doburp \n"
            # print(script_content)
        content = {'scripts': "", "iosscript":script_content}

    elif "IOSChangeRetval" == doburp_type:
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
                # 'methodtag': methodtag
            }
            script_content += render('./scripts/doburp_iosChangeRetvalTemplate.js', context)
            script_content += "\n// Added doburp \n"
            # print(script_content)
        content = {'scripts': "", "iosscript":script_content}

    result = render('./scripts/doburp.js', content)
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
            script_content += "\n// Added Function \n"
    # print(script_content)
    content = {'scripts': script_content, 'iosscript': iosscript_content}
    result = render('./scripts/Export.js', content)
    # print(result)
    loadScript(result)


@socketio.on('rpcExport', namespace='/defchishi')
def exportrpc(message):
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
    # print(script_content)
    content = {'scripts': script_content, 'iosscript': iosscript_content}
    result = render('./scripts/Export.js', content)
    # print(result)
    loadScript(result)


@socketio.on('findhook', namespace='/defchishi')
def findhook(message):
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
def doLoadHook(message):
    hooks_list = message.get('hooks_list')
    matchtext = hooks_list.get('matchtext')
    hookOptions_lists = message.get('hookOptions_lists')
    hookOptions_list = hookOptions_lists.get('hookOptions_list')
    # print(matchtext)
    # print(hookOptions_list)
    options = ""
    for item in hookOptions_list:
        options += "!methodName.startsWith(\"%s\") " % item if "" == options else "&& !methodName.startsWith(\"%s\") " % item

    logger.info("HooksMatch: %s, Options: %s" % (matchtext, options))
    if "" == options:
        content = {
            'hookslist': matchtext,
            'options': "methodName.startsWith(\"\")",
        }
    else:
        content = {
            'hookslist': matchtext,
            'options': options,
        }
    script_content = render('./scripts/hooks.js', content)
    # print(script_content)
    loadScript(script_content)


@socketio.on('loadfindclassScript',namespace='/defchishi')
def dofindclass(message):
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

