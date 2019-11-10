# coding:utf-8
import requests
import base64
import json

def main():
    url = "http://127.0.0.1:8088/bcall"
    methodtag = "tag94323745d0c8a4c174e41081bd50002301"
    valuse = 'HTTPDecrypt'
    print("values: {}".format(valuse))
    argsinfo = base64.b64encode(valuse.encode("utf-8")).decode("utf-8")
    argsinfo = json.dumps({"0":argsinfo})

    data = {"methodtag":base64.b64encode(methodtag.encode("utf-8")).decode("utf-8"),"argsinfo":argsinfo}
    print("argsinfo:{}".format(json.dumps(data)))
    result = requests.post(url=url,data=data)
    print("result: {}".format(result.text))

if __name__ == '__main__':
    main()