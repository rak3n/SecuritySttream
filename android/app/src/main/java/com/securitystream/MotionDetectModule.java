// package com.securitystream;

// import com.facebook.react.bridge.NativeModule;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.modules.core.DeviceEventManagerModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.Callback;
// import android.content.Context;
// import java.util.Map;
// import java.util.HashMap;

// import com.securitystream.motiondetection.MotionDetectorCallback;
// import com.securitystream.motiondetection.MotionDetector;


// public class MotionDetectModule extends ReactContextBaseJavaModule {

//     private MotionDetector motion;

//    MotionDetectModule(ReactApplicationContext context) {
//        super(context);
//    }

//    @ReactMethod
//     public void startDetect(Double sensi, Callback call) {

//         motion = new MotionDetector(getCurrentActivity(), getReactApplicationContext());

//         motion.setMotionDetectorCallback(new MotionDetectorCallback() {
//             @Override
//             public void onMotionDetected() {
//                 // txtStatus.setText("Motion detected");
//                 getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("MotionDetected", "Motion");
//             }

//             @Override
//             public void onTooDark() {
//                 getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("MotionDetected", "tOO dARK");
//             }
//         });
//     }

//     @ReactMethod
//     public void onResume() {
//         // super.onResume();
//         motion.onResume();

//         if (motion.checkCameraHardware()) {
//             getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Camera", "Camera Started");
//         } else {
//             getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Camera", "No Camera");
//         }
//     }

//     @ReactMethod
//     public void onPause() {
//         // super.onPause();
//         motion.onPause();
//     }

//    @Override
//     public String getName() {
//        return "MotionDetectModule";
//     }
// }