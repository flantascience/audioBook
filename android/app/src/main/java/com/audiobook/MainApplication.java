package com.audiobook;

import android.Manifest;
import android.app.Application;
import android.content.pm.PackageManager;
import android.os.Build;
//import android.util.Log;

import com.facebook.react.PackageList;
//import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
//import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

import io.invertase.firebase.database.RNFirebaseDatabasePackage;
//import io.invertase.firebase.storage.RNFirebaseStoragePackage;

//RN file downloader package
import com.rnfs.RNFSPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

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
          packages.add(new RNFSPackage());
        }
      }else{
        packages.add(new RNFSPackage());
      }

      packages.add(new RNFirebaseDatabasePackage());
      //packages.add(new TrackPlayer());
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

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
