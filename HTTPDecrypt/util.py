# - * - coding:utf-8 - * -
from globalenv import socketio, genv
import json
import requests
import hashlib
import time
import frida
import subprocess
from log import logger
import cgi

BURP_HOST = "localhost"
BURP_PORT = 26000


def on_message(message, data):
    """
        接收JavaScript代码返回的数据
        还需要注册一个message handler
    """
    arrstr = "-Aoor00ooray-"
    if message['type'] == 'send':
        info = message.get("payload")
        # print(info)
        if "-h00oOOoks-" in info:
            j_info = json.loads(info.replace('-h00oOOoks-',''))
            method_stack = j_info.get("method_stack")
            arg_type = j_info.get("arg_type")
            arg_dump = j_info.get("arg_dump")
            retval_dump = j_info.get("retval_dump")
            targetClassMethod = j_info.get("targetClassMethod")
            s_arg_dump = ''
            # arg_dump_list = arg_dump.split(",")
            # for item in arg_dump_list:
            s_arg_dump += arg_dump.replace("-lioonooe-", '<br />')

            ClassMethod  = targetClassMethod + "(" + arg_type.replace("-lioonooe-", "<br />") + ")"
            info_dict = {"methodname": ClassMethod, "args": s_arg_dump, "retval": retval_dump, "stacklist": method_stack.replace("-lineline-","<br />")}
            socketio.emit('new_hook_message',
                          {'data': json.dumps(info_dict)},
                          namespace='/defchishi')
        elif "-ho0ookoiooos-" in info:
            j_info = json.loads(info.replace('-ho0ookoiooos-',''))
            socketio.emit('ios_hook_message',
                          {'data': json.dumps(j_info)},
                          namespace='/defchishi')
            # print(j_info)

        elif "-in00sOpOeooct-" in info:
            j_info = json.loads(info.replace('-in00sOpOeooct-',''))
            isAndroid = j_info.get("isAndroid")
            methodInfo = j_info.get("methodInfo")

            if "True" == isAndroid:
                pkg_class_method_name = {"classname": j_info.get("classname"), "methodname": j_info.get("methodname"), 'classtag': hashlib.md5(j_info.get("classname").encode(encoding='UTF-8') + j_info.get("methodname").encode(encoding='UTF-8')).hexdigest()}
                # print(pkg_class_method_name)
            else:
                pkg_class_method_name = {"classname": j_info.get("classname"), 'classtag': hashlib.md5(j_info.get("classname").encode(encoding='UTF-8')).hexdigest()}
            
            httpout = "<label>Output</label><p><code id='pkg_class_method_name_code'>{}</code></p>".format(
                json.dumps(pkg_class_method_name))

            httpout += """
                <div class="form-group">
                    <label for="name">Overloads: </label>
                    <select class="form-control" id="select_result">
                    """
            for item in range(0, len(methodInfo)):
                httpout += "<option value={}>{}</option>".format(str(item),
                                                                 str(json.dumps(methodInfo[item])).replace('\\\"', ''))

            httpout += """</select>
                        </div>
                    <input onclick="addinfo()" class="btn btn-default "  style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="add">
                    <input onclick="findhook()" class="btn btn-default " style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="hook">
                    <input onclick="rpcExport()" class="btn btn-default " style="width:130px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="export static">
                    <input onclick="rpcExportInstance()" class="btn btn-default " style="width:130px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="export instance">
                    """
            if "True" == isAndroid:
                httpout += """
                    <input onclick="doburp('Android')" class="btn btn-default" style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="toBurp">
                    """
            else:
                httpout += """
                    <input onclick="doburp('IOSArgs')" class="btn btn-default" style="width: 150px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="toBurp arguments">
                    <input onclick="doburp('IOSRetval')" class="btn btn-default" style="width: 130px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="toBurp retval">
                """
            
            # httpout += """</select>
            #         </div>
            #     <input onclick="addinfo()" class="btn btn-default "  style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="add">
            #     <input onclick="findhook()" class="btn btn-default " style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="hook">
            #     <input onclick="rpcExport()" class="btn btn-default " style="width:130px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="export static">
            #     <input onclick="rpcExportInstance()" class="btn btn-default " style="width:130px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="export instance">
            #     <input onclick="doburp()" class="btn btn-default" style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="toBurp">
            #     """

            httparr = {'result': httpout}
            socketio.emit('input_result', httparr, namespace='/defchishi')
        elif "-to0obuooO0rp-" in info:
            # print(info);
            jinfo = json.loads(info.replace('-to0obuooO0rp-', ''))
            uri = jinfo.get("uri")
            jinfo.pop("uri")
            data = json.dumps(jinfo, indent=4)
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            req = requests.request('FRIDA', 'http://%s:%d/%s' % (BURP_HOST, BURP_PORT, uri), headers=headers,
                                   data=data.encode('UTF-8'))
            # req.encoding='utf-8'
            # print("req.text:" + req.text)
            genv.script.post({'type': 'input', 'payload': req.text})
            # print(info.replace('-to0obuooO0rp-',''))
        elif "-t00eoo00mp-" in info:
            j_info = json.loads(info.replace('-t00eoo00mp-', ''))
            targetClassMethod = j_info.get("targetClassMethod")
            method = j_info.get("method")
            info_dict = {"methodname": targetClassMethod,"method": method }
            socketio.emit('temp',
                          {'data': json.dumps(info_dict)},
                          namespace='/defchishi')
        elif "-fO0ioon00ds-" in info:
            j_info = json.loads(info.replace('-fO0ioon00ds-',''))
            pkgname = j_info.get("pkgname")
            classname = j_info.get("classname")
            fullclassname = j_info.get("fullclassname")
            methodinfo = j_info.get("methodinfo")
            methodname = j_info.get("methodname")
            Accesspermissions = j_info.get("Accesspermissions")
            find_info_dict = {"pkgname": pkgname, "classname": classname, "fullclassname": fullclassname, "methodinfo": methodinfo, "methodname": methodname, "Accesspermissions": Accesspermissions}
            socketio.emit('find_message',
                          {'data': json.dumps(find_info_dict)},
                          namespace='/defchishi')
        elif "-fi0n0dh0o0ok-" in info:
            j_info = json.loads(info.replace('-fi0n0dh0o0ok-', ''))
            # print(j_info)
            socketio.emit('findhook_message',
                          {'data': cgi.escape(json.dumps(j_info))},
                          namespace='/defchishi')
        elif "-enuoom0N0a0ti0ve-" in info:
            j_info = json.loads(info.replace('-enuoom0N0a0ti0ve-', ''))
            socketio.emit('enumNative_message',
                          {'data': json.dumps(j_info)},
                          namespace='/defchishi')
        elif "-iooos00fi0nd0cla0ssm0et0hod-" in info:
            j_info = json.loads(info.replace('-iooos00fi0nd0cla0ssm0et0hod-',''))
            socketio.emit('findobjcclass_message',
              {'data': json.dumps(j_info)},
              namespace='/defchishi')
            # print(j_info)
        elif "-se00nood00tooag-" in info:
            log = info.replace("-se00nood00tooag-","")
            logger.info(log);
        # elif "-CrOOooyp00to-" in info:
        #     my_json = json.loads(info.replace('-CrOOooyp00to-', ''))
        #     print(my_json)
        #     if 'encrypt'==my_json.get("type"):
        #         my_json['before_doFinal'] = binascii.a2b_hex(my_json.get('before_doFinal')).decode('utf-8')
        #     else:
        #         my_json['after_doFinal'] = binascii.a2b_hex(my_json.get('after_doFinal')).decode('utf-8')
        #     # my_json['after_doFinal'] = binascii.a2b_hex(my_json.get('after_doFinal')).decode('utf-8')
        #     socketio.emit('Crypto_message', {'data':json.dumps(my_json)}, namespace='/defchishi')

        else:
            logger.error("no message!!!!!")

    elif message['type'] == 'error':
        if(message.get('description') != None):
            print(message)
            logger.error("on_message description is: %s" % message.get('description'))
        else:
            logger.error("on_message  No description")

def loadScript(script_content):
    try:
        rdev = genv.get_device()
        process_name = genv.get_pkgname()
        if process_name == None:
            logger.info("PackagaName is null, please input.")
            # print(colored("[ERROR] PackagaName is null, please input.", "red"))
            return
        # if genv.script != None:
        #     logger.info("Script_unload..")
        #     try:
        #         genv.script.unload()
        #     except Exception as e:
        #         print(e)
        pkg = rdev.get_process(process_name).pid
        genv.session = rdev.attach(pkg)
    except frida.ServerNotRunningError as e:
        logger.error("frida-server No Running ....please check.")
        return
        # app.logger.error("frida_server No Running! or port no forward! please check.")
    except frida.ProcessNotFoundError as e:
        try:
            pkg = rdev.spawn([process_name])
            genv.session = rdev.attach(pkg)
            rdev.resume(pkg)
        except Exception as e:
            logger.error("%s" % e)
            return
    except Exception as e:
        logger.error("loadScript: %s" % e)
        return
        # print(colored("[ERROR] loadScript: %s" % e, "red"))
    # else:
    logger.info("create_script")
    logger.info("Hook App: %s" % process_name)
    # # print(process)
    # if process:
    #     logger.error("process is null, please check")
    #     # print(colored("[ERROR] .", "red"))
    #     return
    if genv.session is None:
        logger.error("genv.session is null, please check")
        return
    genv.script = genv.session.create_script(script_content)  # 注册js代码
    time.sleep(1)
    logger.info("script_on...")
    genv.script.on("message", on_message)  # on()方法注册message handler
    genv.script.load()
