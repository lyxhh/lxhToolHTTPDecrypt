## Installation

Android Device requires root.

Make sure to install python3 and configure environment variables

1. **Install dependency libraries**
`pip3 install colorlog flask flask_socketio requests`
2. Choose [frida-server-version-android-arch.xz](https://github.com/frida/frida/releases) according to the phone architecture
3. Unzip xz and upload to /data/local/tmp using [adb](https://developer.android.com/studio/releases/platform-tools)
`adb push frida-server-12.5.0-android-arm /data/local/tmp`
4. Give frida-server permission and run
```
adb shell
su root
cd /data/local/tmp
chmod 777 frida-server-12.5.0-android-arm
./frida-server-12.5.0-android-arm
```
5. run app.py，Browser access to http://127.0.0.1:8088/ .
`python3 app.py`
6. You will see the following page.
![start](images/start.png)

Note:**If there is no data on the start page, try refreshing the page or filling in any PackageName and clicking on Confirm**