package com.securitystream.nativeview;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.hardware.Camera;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.os.Build;
import android.os.Handler;

import android.os.Looper;
import android.os.Message;
// import android.support.annotation.IntDef;
// import android.support.annotation.NonNull;
import android.util.Log;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import com.securitystream.motiondetection.MotionDetectorCallback;
import com.securitystream.motiondetection.MotionDetector;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;


// import com.securitystream.nativeview.RNCommunication;

import android.os.Vibrator;

public class HMSurfaceView extends SurfaceView {
    private ThemedReactContext ctx;
    private MotionDetector motion;
    // private RNCommunication comm;s

    public HMSurfaceView(ThemedReactContext context) {
        super(context);
        ctx=context;
        initMotionDetect();
    }

    private void initMotionDetect(){

        motion = new MotionDetector(this, 10);
        motion.setMotionDetectorCallback(new MotionDetectorCallback() {
            @Override
            public void onMotionDetected() {
                Vibrator v = (Vibrator) ctx.getSystemService(Context.VIBRATOR_SERVICE);
                v.vibrate(80);

                WritableMap args = Arguments.createMap();
                args.putInt("motion", 1);

                ctx.getJSModule(RCTEventEmitter.class).receiveEvent(getId(),"onMotion",args);
                // txtStatus.setText("Motion detected");
                // ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("MotionDetected", "Motion");
            }

            @Override
            public void onTooDark() {
                // ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("MotionDetected", "tOO dARK");
            }
        });

        motion.onResume();
    }

    public void setSenstivity(int sensi){
        Log.d("MotionDetector","value Changes to: "+sensi);
        motion.setSenstivity(sensi);
        // motion = new MotionDetector(this, sensi);
    }



    private void initSurface() {
        SurfaceHolder surfaceHolder = getHolder();
        initMotionDetect();
        surfaceHolder.addCallback(new SurfaceHolder.Callback() {

            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                motion.onResume();                
            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
                motion.onPause();
                motion.onResume();
            }

            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {
                motion.onPause();
            }
        });
    }

    // private void drawBlue(Rect react) {
    //     Canvas canvas = getHolder().lockCanvas(react);
    //     if (canvas != null) {
    //         canvas.drawColor(Color.BLUE);
    //         getHolder().unlockCanvasAndPost(canvas);
    //     }
    // }
}