## Installation

IOS Device 需要越狱.

确保安装python3并配置环境变量

1. **安装依赖库**
`pip3 install colorlog flask flask_socketio requests frida-tools`
2. 安装frida-server
打开Cydia 并 添加frida源  `https://build.frida.re` , 然后搜索frida并安装.
3. 安装与frida-server相同版本的python库
```
pip3 install frida==12.5.0
```
3. run app.py，浏览器访问 http://127.0.0.1:8088/ ..
`python3 app.py`
4. 你将看下如下界面.
![start](images/iosstart.png)

Note:**如果起始页面上没有数据，请尝试刷新页面或 填写任何Identifier并单击"Confirm"**

pps: 在Windows下使用，要装iTunes。