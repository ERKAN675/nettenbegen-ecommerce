@echo off
echo ========================================
echo Nettenbegen Mobile APK Builder
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo Node.js and npm are installed.
echo.

REM Check if EAS CLI is installed
eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing EAS CLI...
    npm install -g eas-cli
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install EAS CLI!
        pause
        exit /b 1
    )
)

echo EAS CLI is installed.
echo.

echo ========================================
echo Choose your build method:
echo ========================================
echo 1. EAS Cloud Build (Recommended - Requires Expo account)
echo 2. Local Build (Requires Android SDK)
echo 3. Development Build (For testing)
echo 4. Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto eas_build
if "%choice%"=="2" goto local_build
if "%choice%"=="3" goto dev_build
if "%choice%"=="4" goto exit
goto invalid_choice

:eas_build
echo.
echo ========================================
echo EAS Cloud Build
echo ========================================
echo.
echo This will build your APK in the cloud.
echo You need to have an Expo account.
echo.
echo 1. Create account at https://expo.dev/signup
echo 2. Login with: eas login
echo 3. Build with: eas build -p android --profile preview
echo.
pause
goto exit

:local_build
echo.
echo ========================================
echo Local Build
echo ========================================
echo.
echo This requires Android SDK to be installed.
echo.
echo Prerequisites:
echo - Android Studio
echo - Android SDK
echo - Java JDK
echo.
echo Steps:
echo 1. Install Android Studio
echo 2. Set ANDROID_HOME environment variable
echo 3. Run: npx expo prebuild
echo 4. Run: cd android && ./gradlew assembleRelease
echo.
pause
goto exit

:dev_build
echo.
echo ========================================
echo Development Build
echo ========================================
echo.
echo Starting development server...
echo.
echo 1. Install Expo Go app on your Android device
echo 2. Scan the QR code that appears
echo 3. Test the app on your device
echo.
npx expo start
goto exit

:invalid_choice
echo.
echo Invalid choice! Please enter 1, 2, 3, or 4.
echo.
pause
goto exit

:exit
echo.
echo Thank you for using Nettenbegen Mobile APK Builder!
echo.
pause
