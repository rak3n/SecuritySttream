package com.securitystream.nativeview;

import android.annotation.TargetApi;
import android.os.Build;
import android.view.SurfaceView;
import android.view.View;
import com.facebook.react.uimanager.annotations.ReactProp;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.common.MapBuilder;

import java.util.Map;

/**
 * Created by mluhui on 2017/7/3.
 */

public class SurfaceViewManager extends SimpleViewManager<View> {
    private HMSurfaceView view;
    @Override
    public String getName() {
        return "SurfaceView";
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        view = new HMSurfaceView(reactContext);
        return view;
    //    View view = new View(reactContext);
    //    view.setBackgroundColor(reactContext.getResources().getColor(android.R.color.holo_blue_bright));
    //    return view;
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "onMotion",
                MapBuilder.of("registrationName", "onMotion")
        );
    }

    @ReactProp(name = "senstivity")
    public void setSenstivity(View reactView, int senstivity) {
        view.setSenstivity(senstivity);
    }
}