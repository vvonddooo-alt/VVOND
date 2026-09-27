# WOND Android APK

This Capacitor 7 project wraps the same WOND web app in `www/`.

## Build
1. Install Node.js, Android Studio and Android SDK.
2. Run `npm install` in this folder.
3. Run `npx cap add android` once.
4. Run `npx cap sync android`.
5. Run `npx cap open android` and build a signed APK/AAB.

The current build environment has Java but no Android SDK/Gradle toolchain, so the APK cannot be compiled here yet; the app files and wrapper configuration are prepared.
