# coding:utf-8

import frida
from flask import Flask
from flask_login import LoginManager
from flask_socketio import SocketIO


class Globalenv(object):
    def __init__(self):
        self.device_manager = None
        self.device = None
        self.script = None
        self.packagename = None
        self.session = None

    def set_pkgname(self,pkg):
        self.packagename = pkg

    def get_pkgname(self):
        return self.packagename

    # def set_device(self, port):
    #     devm = frida.get_device_manager()
    #     rdev = devm.add_remote_device("127.0.0.1:%s" % port)
    #     # rdev = devm.add_remote_device("127.0.0.1:23456")
    #     self.device = rdev

    def get_device(self):
        self.device = frida.get_device_manager().enumerate_devices()[-1]
        return self.device

app = Flask(__name__)
async_mode = None
socketio = SocketIO(app, async_mode=async_mode)
# login_manager = LoginManager()
# login_manager.init_app(app)

# thread = None
# thread_lock = Lock()
# random_token = uuid.uuid4().hex
app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SECRET_KEY'] = 'secret!'
genv = Globalenv()