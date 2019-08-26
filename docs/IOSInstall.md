## Installation

IOS Device requires jailbroken.

Make sure to install python and configure environment variables

1. **Install dependency libraries**
`pip3 install colorlog flask flask_socketio requests`
2. Start Cydia and add Frida’s repository `https://build.frida.re` , find and install the Frida package
3. run app.py，Browser access to http://127.0.0.1:8088/ .
`python3 app.py`
4. You will see the following page.
![start](images/iosstart.png)

Note:**If there is no data on the start page, try refreshing the page or filling in any PackageName and clicking on Confirm**