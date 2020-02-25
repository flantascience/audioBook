package com.curricu_dumb_audiobook;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Application;
import android.content.pm.PackageManager;
import android.os.Build;
//import android.os.Bundle;
// import android.util.Log;

//import com.facebook.react.BuildConfig; /*caused crashes*/
import com.google.firebase.remoteconfig.FirebaseRemoteConfig;
import com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings;

import com.facebook.react.PackageList;
// import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
// import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;

//import io.branch.referral.Branch;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
// import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

// RN file downloader package
//import com.rnfs.RNFSPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private FirebaseRemoteConfig mFirebaseRemoteConfig;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @SuppressLint("MissingPermission")
    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage())'
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED &&
                checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
          // TODO: Consider calling
          //    Activity#requestPermissions
          // here to request the missing permissions, and then overriding
          //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
          //                                          int[] grantResults)
          // to handle the case where the user grants the permission. See the documentation
          // for Activity#requestPermissions for more details.
          //packages.add(new RNFSPackage());
        }
      }
      packages.add(new RNFirebaseDatabasePackage());
      packages.add(new RNFirebaseAnalyticsPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  // [START declare_analytics]
  // protected FirebaseAnalytics mFirebaseAnalytics;
  // [END declare_analytics]

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    //Remote things
    mFirebaseRemoteConfig = FirebaseRemoteConfig.getInstance();
    FirebaseRemoteConfigSettings configSettings = new FirebaseRemoteConfigSettings.Builder()
            .setMinimumFetchIntervalInSeconds(1000)
            .build();
    mFirebaseRemoteConfig.setConfigSettingsAsync(configSettings);
  }
}
