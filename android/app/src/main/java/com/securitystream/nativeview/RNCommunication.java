package com.securitystream.nativeview;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.content.Context;
import java.util.Map;
import java.util.HashMap;

import com.securitystream.motiondetection.MotionDetectorCallback;
import com.securitystream.motiondetection.MotionDetector;

class RNCommunication extends ReactContextBaseJavaModule {

    public void sendCameraLog(String message){
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Camera", message);
    }

    public void sendMotionLog(String message){
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Motion", message);
    }

   @Override
    public String getName() {
       return "MotionDetectModule";
    }
}