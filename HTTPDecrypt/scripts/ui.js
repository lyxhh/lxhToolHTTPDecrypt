function main(){
    if (ObjC.available) {
		send("-Ge0ne0raoteio0sui-");
    }else if(Java.available) {
    	send("-an0Od0orooid0ouoid0ump-");
        AndroidUIDump();
    }
}


function AndroidUIDump(){
	// https://github.com/githubwing/DroidSword
	Java.perform(function() {
		var frag = Java.use("android.support.v4.app.Fragment");
		frag.onResume.implementation = function(){
			// console.log(this.$className);
			try{
				// var classname = this.$className;
				send(this.$className + "-F00ragoome0ont-");
				return this.onResume();
			}
			catch (e) {
				return this.onResume();
			}
		};

		frag.setUserVisibleHint.implementation = function(a0){
			try {
				if (a0 == "true") {
					send(this.$className + "-F00ragoome0ont-");
					// console.log("set:" +this.$className);
				}
				return this.setUserVisibleHint(a0);
			}catch (e) {
				return this.setUserVisibleHint(a0);
			}
		};

		var View = Java.use("android.view.View");
		var onClickListenerName ;

		View.onTouchEvent.overload('android.view.MotionEvent').implementation = function(event) {
			try {
				var ClickAndListener = {};
				if (event.getAction() != 1) {
					return this.onTouchEvent(event);
				}
				// var onClickListenerName = this.mListenerInfo.value.mOnClickListener.value.$className;
				var mListenerInfo = this.mListenerInfo;
				var objectField = null;
				if (mListenerInfo != null) {
					try {
						objectField = mListenerInfo.value.mOnClickListener;
					} catch (e) {
					}
				}
				if (objectField == null) {
					onClickListenerName = "None";
				} else {
					onClickListenerName = objectField.value.$className;
				}
				ClickAndListener['onClickListenerName'] = onClickListenerName;
				ClickAndListener['onClickViewName'] = this.$className + " "+ this.getId();

				send(JSON.stringify(ClickAndListener) + "-Clioo0ckA0n0dLisootener-");
				// console.log(onClickListenerName);
				// console.log(this.$className+": "+this.getId());
				return this.onTouchEvent(event);
			}catch (e) {
				// console.log(e);
				return this.onTouchEvent(event);
			}
		};

		var AdapterView = Java.use("android.widget.AdapterView");
		View.dispatchTouchEvent.overload('android.view.MotionEvent').implementation = function(event){
			try {
				var ClickAndListener = {};
				if (event.getAction() == 0) {
					var env = Java.vm.getEnv();
					var handle = this.hasOwnProperty('$handle') ? this.$handle : this;
					var classHandle = AdapterView.$getClassHandle(env);
					try {
						const isValidCast = env.isInstanceOf(handle, classHandle);
						if (isValidCast) {
							var listene = this.mOnItemClickListener;
							if (listene != undefined) {
								onClickListenerName = listene.value.$className;
								ClickAndListener['onClickListenerName'] = onClickListenerName;
								ClickAndListener['onClickViewName'] = this.$className + " "+ this.getId();
								send(JSON.stringify(ClickAndListener) + "-Clioo0ckA0n0dLisootener-");
								// console.log("ada: " + onClickListenerName);
							}
						}
					} finally {
						env.deleteLocalRef(classHandle);
					}
				}
				return this.dispatchTouchEvent(event);
			}catch (e) {
				return this.dispatchTouchEvent(event);
			}
		};

		var activity = Java.use("android.app.Activity");
		activity.$init.implementation = function(){
			try {
				var Activitys = {};
				Activitys['ActivityName'] = this.$className;
				Activitys['pid'] = Process.id;
				send(JSON.stringify(Activitys) + "-Act0ivo0oitOys-");
				// console.log("activity: " + this.$className);
				return this.$init();
			}catch (e) {
				return this.$init();
			}
		};
	});
}

setImmediate(function() {
	send("UI running..." + "-se00nood00tooag-");
	//打印堆栈
	main();
});