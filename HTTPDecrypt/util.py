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
import html
from os.path import dirname, abspath
import os
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
                    <input onclick="Generate('findhook')" class="btn btn-default " style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="hook">
                    <input onclick="Generate('rpcExport')" class="btn btn-default " style="width:130px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="export static">
                    <input onclick="Generate('rpcExportInstance')" class="btn btn-default " style="width:130px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="export instance">
                    """
            if "True" == isAndroid:
                httpout += """
                    <input onclick="doburp('Android','normal')" class="btn btn-default" style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="toBurp">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Generate <span class="caret"></span></button>
                        <ul class="dropdown-menu">
                          <li><a href="#" onclick="Generate('GenerateExportStatic')">Generate export static script</a></li>
                          <li><a href="#" onclick="Generate('GenerateExportInstance')">Generate export instance script</a></li>
                          <li><a href="#" onclick="doburp('Android','update')">Generate toBurp script</a></li>
                        </ul>
                    </div>
                    """
            else:
                httpout += """
                    <input onclick="doburp('IOS','normal')" class="btn btn-default" style="width: 90px;height: 32px; margin-bottom: 2px;margin-top: 2px;" value="toBurp">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Generate <span class="caret"></span></button>
                        <ul class="dropdown-menu">
                          <li><a href="#" onclick="Generate('GenerateExportStatic')">Generate export static script</a></li>
                          <li><a href="#" onclick="Generate('GenerateExportInstance')">Generate export instance script</a></li>
                          <li><a href="#" onclick="doburp('IOS','update')">Generate toBurp script</a></li>
                        </ul>
                    </div>
                """

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
        elif "-natooiv00einoofo-" in info:
            j_info = json.loads(info.replace('-natooiv00einoofo-', ''))
            socketio.emit('nativeinfo',
                          {'data': json.dumps(j_info)},
                          namespace='/defchishi')
        elif "-iooos00fi0nd0cla0ssm0et0hod-" in info:
            j_info = json.loads(info.replace('-iooos00fi0nd0cla0ssm0et0hod-',''))
            socketio.emit('findobjcclass_message',
              {'data': json.dumps(j_info)},
              namespace='/defchishi')
            # print(j_info)
        elif "-F00ragoome0ont-" in info:
            FragmentName = info.replace("-F00ragoome0ont-", "")
            socketio.emit('getFragmentClassName',
                        {'data': FragmentName},
                        namespace='/defchishi')
            # logger.info(log)
        elif "-Clioo0ckA0n0dLisootener-" in info:
            ClickAndListener = info.replace("-Clioo0ckA0n0dLisootener-", "")
            socketio.emit('GetClickAndListenerName',
                {'data': ClickAndListener},
              namespace='/defchishi')

        elif "-Act0ivo0oitOys-" in info:
            Activitys = info.replace("-Act0ivo0oitOys-", "")
            socketio.emit('GetActivityName',
                          {'data': Activitys},
                          namespace='/defchishi')
            # logger.info(log)
        elif "-se00nood00tooag-" in info:
            log = info.replace("-se00nood00tooag-", "")
            logger.info(log)
        elif "-er00roo000r-" in info:
            log = info.replace("-er00roo000r-", "")
            logger.error(log)
        elif "-An0odr0ooidosc0reoen0sh0ot-" in info:
            try:
                logger.info("Screenshot ing...")
                status, _ = subprocess.getstatusoutput("adb shell /system/bin/screencap -p /data/local/tmp/screen.png")
                imageName = '{}\\cache\\Screenshot\\{}.png'.format(dirname(abspath(__file__)),
                                                                   genv.get_pkgname().replace('.', '_') + time.strftime(
                                                                       '_%Y%m%d%H%M%S', time.localtime(time.time())))
                if status == 0:
                    logger.info("Screenshot done...")
                    status, _ = subprocess.getstatusoutput("adb pull /data/local/tmp/screen.png {}".format(imageName))
                    if status == 0:
                        logger.info('Screenshot saved to: {}'.format(imageName))
            except Exception as e:
                logger.error("Screenshot Error, Reason is {}".format(e))
        elif "-i0oossoc0ree0ons0ohot-" in info:
            try:
                logger.info("Screenshot ing...")
                imageName = '{}\\cache\\Screenshot\\{}.png'.format(dirname(abspath(__file__)),
                                                                   genv.get_pkgname().replace('.', '_') + time.strftime(
                                                                       '_%Y%m%d%H%M%S', time.localtime(time.time())))
                logger.info("Screenshot done...")
                with open(imageName, 'wb') as f:
                    f.write(data)
                logger.info('Screenshot saved to: {}'.format(imageName))
            except Exception as e:
                logger.error("IOS Screenshot Error, Reason is {}".format(e))
        elif "-do0wn0looadoApopo-" in info:
            try:
                app_name = '{}\\cache\\apk\\{}.apk'.format(dirname(abspath(__file__)),
                                                                   genv.get_pkgname().replace('.', '_'))
                status, res = subprocess.getstatusoutput("adb shell pm path {}".format(genv.get_pkgname()))
                app_path_lists = res.split('\n')
                download_app_path = None
                for i in app_path_lists:
                    if "base.apk" in i:
                        download_app_path = i.split(":")[-1]
                        break
                if download_app_path is not None:
                    logger.info("Apk path: {}".format(download_app_path))
                    status, _ = subprocess.getstatusoutput("adb pull {} {}".format(download_app_path, app_name))
                    if status == 0:
                        logger.info('App saved to: {}'.format(app_name))
                else:
                    logger.warning("Not found base.apk")
                # print(download_apk_path)
            except Exception as e:
                logger.error("download App Error, Reason is {}".format(e))
        elif "-io0o0sdo0wn0looadoApopo-" in info:
            socketio.emit('IOSDumpApp',
                          {'data': info.replace("-io0o0sdo0wn0looadoApopo-", "")},
                          namespace='/defchishi')
        elif "-cusoto0oom0sc0ri0pt-" in info:
            socketio.emit('CustomScript',
                          {'data': info.replace("-cusoto0oom0sc0ri0pt-", "")},
                          namespace='/defchishi')
        elif "-an0Od0orooid0ouoid0ump-" in info:
            socketio.emit('AndroidUIDump',
                          {'data': info.replace("-an0Od0orooid0ouoid0ump-", "")},
                          namespace='/defchishi')
        elif "-io0soui0du0mop-" in info:
            socketio.emit('IOSUIDump',
                          {'data': info.replace("-io0soui0du0mop-", "").replace("<", "&lt;").replace(">", "&gt;")},
                          namespace='/defchishi')
        elif "-Ge0ne0raoteio0sui-" in info:
            socketio.emit('GenerateUiButtom',
                          {'data': info.replace("-Ge0ne0raoteio0sui-", "")},
                          namespace='/defchishi')
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
        if message.get('description') is not None:
            # print(message)
            logger.error("on_message description is: %s" % message.get('description'))
        else:
            logger.error("on_message  No description")


def loadScript(script_content):
    try:
        rdev = genv.get_device()
        process_name = genv.get_pkgname()
        if process_name is None:
            logger.info("Identifier is null, please input.")
            return "no"
        if genv.isAndroid is not None and not genv.isAndroid:
            process_name = genv.allApp[process_name]

        pkg = rdev.get_process(process_name).pid
        genv.session = rdev.attach(pkg)
        # genv.session = frida.get_usb_device().attach("MyFirstIOS")
        logger.info("create_script")
        logger.info("Hook App: %s" % process_name)

        time.sleep(1)
        genv.script = genv.session.create_script(script_content)  # 注册js代码
        logger.info("script_on...")
        genv.script.on("message", on_message)  # on()方法注册message handler
        genv.script.load()
    except frida.ServerNotRunningError as e:
        logger.error("frida-server No Running ....please check.")
        return "no"
    except Exception as e:
        logger.error("Script failed to load, Reason is %s, Try restarting the app to continue loading the script. " % e)
        try:
            process_name = genv.get_pkgname()
            if process_name is None:
                logger.info("Identifier is null, please input.")
                return "no"
            pkg = rdev.spawn([process_name])
            genv.session = rdev.attach(pkg)
            rdev.resume(pkg)

            time.sleep(1)

            logger.info("create_script")
            logger.info("Hook App: %s" % process_name)

            genv.script = genv.session.create_script(script_content)  # 注册js代码
            # print(script_content)
            logger.info("script_on...")
            genv.script.on("message", on_message)  # on()方法注册message handler
            genv.script.load()
        except Exception as e:
            logger.error("The script failed to load again, Reason is %s." % e)
            return "no"


def sleep_load_scipt(script_content):
    try:
        rdev = genv.get_device()
        process_name = genv.get_pkgname()
        if process_name is None:
            logger.info("Identifier is null, please input.")
            return "no"
        pkg = rdev.spawn([process_name])
        genv.session = rdev.attach(pkg)

        logger.info("sleep resume app...")
        logger.info("Hook App: %s" % process_name)

        genv.script = genv.session.create_script(script_content)

        logger.info("script_on...")
        genv.script.on("message", on_message)  # on()方法注册message handler
        genv.script.load()
        rdev.resume(pkg)
    except Exception as e:
        logger.error("The script failed to load again, Reason is %s." % e)


def isAndroid(device):
    for app in device.enumerate_processes():
        if app.name == "adbd":
            return True
    return False
