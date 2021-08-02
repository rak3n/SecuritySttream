package com.securitystream.motiondetection;

public interface MotionDetectorCallback {
    void onMotionDetected();
    void onTooDark();
}