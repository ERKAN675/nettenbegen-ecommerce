# Nettenbegen Mobile APK Build Guide

## Option 1: Using EAS Build (Recommended - Cloud Build)

### Prerequisites:
1. Create a free Expo account at https://expo.dev/signup
2. Install EAS CLI: `npm install -g eas-cli`

### Steps:
1. Login to EAS:
   ```bash
   eas login
   ```

2. Configure the build:
   ```bash
   eas build:configure
   ```

3. Build the APK:
   ```bash
   eas build -p android --profile preview
   ```

4. Download the APK from the provided link when build completes.

## Option 2: Local Build (Requires Android SDK)

### Prerequisites:
1. Install Android Studio
2. Install Android SDK
3. Set ANDROID_HOME environment variable
4. Install Java JDK

### Steps:
1. Install Android development dependencies:
   ```bash
   npx expo install expo-dev-client
   ```

2. Prebuild the project:
   ```bash
   npx expo prebuild
   ```

3. Build the APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. Find the APK at: `android/app/build/outputs/apk/release/app-release.apk`

## Option 3: Using Expo Go (Development Testing)

### Steps:
1. Install Expo Go app on your Android device
2. Run the development server:
   ```bash
   npx expo start
   ```
3. Scan the QR code with Expo Go app

## Option 4: Using Expo Development Build

### Steps:
1. Create a development build:
   ```bash
   eas build --profile development --platform android
   ```

2. Install the development build on your device
3. Run the development server and connect to it

## Current Project Status

The mobile app is fully configured and ready for building. It includes:

- ✅ Complete React Native Expo setup
- ✅ TypeScript configuration
- ✅ Navigation structure
- ✅ API services
- ✅ All screens and components
- ✅ Proper app configuration
- ✅ Build configuration files

## Next Steps

1. Choose one of the build options above
2. Follow the steps for your chosen method
3. Test the APK on your Android device
4. Distribute the APK as needed

## Troubleshooting

- If you get SDK path errors, install Android Studio and set ANDROID_HOME
- If you get permission errors, make sure you have the necessary permissions
- If the build fails, check the error logs and ensure all dependencies are installed

## Support

For more help with building Expo apps, visit:
- https://docs.expo.dev/build/setup/
- https://docs.expo.dev/build-reference/local-builds/
- https://docs.expo.dev/build-reference/eas-build/
