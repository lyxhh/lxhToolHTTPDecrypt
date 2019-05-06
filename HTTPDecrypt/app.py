# coding:utf-8
from log import logger
from flask import render_template, request
from collections import OrderedDict
from globalenv import genv, app, socketio
from socketutil import *
from util import *
import logging
import base64
import argparse

logg = logging.getLogger('werkzeug')
logg.setLevel(logging.ERROR)

@app.route('/')
def hello():
    return render_template("index.html")


@app.route('/call', methods=['POST'])
def call():
    ArgsInfo = request.form.get('argsinfo')
    MethodTag = request.form.get('methodtag')

    if ArgsInfo is None or MethodTag is None:
        return "Arguments Value is None, please check."
    if genv.script is None:
        return "Export Script no load, please check."
    # print(type(request.form.get('argsinfo')))
    try:
        jArgsInfo = json.loads(ArgsInfo, object_pairs_hook=OrderedDict)
        argumentsinfo = jArgsInfo.values()
        method_to_call = getattr(genv.script.exports, MethodTag)
        # print("123")
        # print(method_to_call(*argumentsinfo))
        return method_to_call(*argumentsinfo)
    except Exception as e:
        return str(e)


@app.route('/bcall', methods=['POST'])
def bcall():
    # print(request.form)
    ArgsInfo = request.form.get('argsinfo')
    MethodTag = base64.b64decode(request.form.get('methodtag')).decode('utf-8')

    if ArgsInfo is None or MethodTag is None:
        return "Arguments Value is None, please check."
    if genv.script is None:
        return "Export Script no load, please check."

    try:
        jArgsInfo = json.loads(ArgsInfo, object_pairs_hook=OrderedDict)
        argumentsinfo = [base64.b64decode(temp).decode('utf-8') for temp in jArgsInfo.values()]
        # print(argumentsinfo)
        method_to_call = getattr(genv.script.exports, MethodTag)
        # print(method_to_call(*argumentsinfo))
        return method_to_call(*argumentsinfo)
    except Exception as e:
        return str(e)


def main():
    parser = argparse.ArgumentParser()
    parser.description = '哈哈哈哈'
    parser.add_argument("-p", "--FlaskPort", help="Specify the Flask port , default port is 8088")
    parser.add_argument("-fp", "--FridaPort", help="Specify the Frida port, default port is 27042")
    args = parser.parse_args()
    # print(args)
    host = "127.0.0.1"
    FlaskPort = 8088 if (args.FlaskPort is None) else args.FlaskPort
    FridaPort = 27042 if (args.FridaPort is None) else args.FridaPort
    # print(FridaPort)
    logger.info("HTTP Decrypt running at http://127.0.0.1:{}".format(FlaskPort))
    genv.set_device(FridaPort)
    socketio.run(app, host=host, port=FlaskPort, debug=False)

if __name__ == '__main__':
    main()
    # socketio.run(app, debug=True)
    # app.run(debug=True)