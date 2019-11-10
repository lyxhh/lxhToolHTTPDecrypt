# - * - coding:utf-8 - * -

import frida
from flask import Flask
from flask_socketio import SocketIO
from log import logger


class Globalenv(object):
    def __init__(self):
        self.device_manager = None
        self.device = None
        self.script = None
        self.packagename = None
        self.session = None
        self.port = 0
        self.isAndroid = None
        self.allApp = {}

    def set_pkgname(self, pkg):
        self.packagename = pkg

    def get_pkgname(self):
        return self.packagename

    def set_device(self, port):
        self.port = int(port)

    def get_device(self):
        # print(self.port)
        if self.port == 0:
            try:
                self.device = frida.get_usb_device()
            except Exception as e:
                logger.error("{}, please wait for few seconds and retry.".format(e))
                return None
        else:
            try:
                devm = frida.get_device_manager()
                self.device = devm.add_remote_device("127.0.0.1:%s" % self.port)
            except Exception as e:
                return self.device
        # self.device = frida.get_usb_device()
        #self.device = frida.get_device_manager().enumerate_devices()[-1] # ios use in window  bug!!!
        return self.device


app = Flask(__name__)
async_mode = None
socketio = SocketIO(app, async_mode=async_mode)

app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SECRET_KEY'] = 'secret!'
genv = Globalenv()
