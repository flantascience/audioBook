package com.curricu_dumb_audiobook;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.json.JSONObject;

//import io.branch.referral.Branch;
//import io.branch.referral.BranchError;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "audioBook";
    }
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
              @Override
              protected ReactRootView createRootView() {
                  return new RNGestureHandlerEnabledRootView(MainActivity.this);
              }
        };
    }
}
