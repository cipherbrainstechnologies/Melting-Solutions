# Run Melting Solution on Android emulator
# Prerequisites (already installed on this machine):
# - Android SDK at %LOCALAPPDATA%\Android\Sdk
# - AVD: MeltingPixel_API30
# - JDK 11 at %LOCALAPPDATA%\Java\jdk-11.0.32.1+1 (for native builds)
# - Expo Go (SDK 44 client) on the emulator

$ErrorActionPreference = "Stop"
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:JAVA_HOME = "$env:LOCALAPPDATA\Java\jdk-11.0.32.1+1"
$env:NODE_OPTIONS = "--openssl-legacy-provider"
$env:Path = "$env:JAVA_HOME\bin;$sdk\platform-tools;$sdk\emulator;$sdk\cmdline-tools\latest\bin;" + $env:Path

Set-Location $PSScriptRoot

# Start emulator if needed
$devices = adb devices | Out-String
if ($devices -notmatch "emulator-\d+\s+device") {
  Write-Host "Starting emulator MeltingPixel_API30..."
  Start-Process "$sdk\emulator\emulator.exe" -ArgumentList @("-avd","MeltingPixel_API30","-netdelay","none","-netspeed","full")
  $deadline = (Get-Date).AddMinutes(3)
  do {
    Start-Sleep -Seconds 5
    $boot = adb -s emulator-5554 shell getprop sys.boot_completed 2>$null
    if ($boot -match "1") { break }
  } while ((Get-Date) -lt $deadline)
}

# Ensure Expo Go is installed
$pkg = adb -s emulator-5554 shell pm path host.exp.exponent 2>$null
if (-not $pkg) {
  Write-Host "Expo Go not found. Install Expo Go SDK 44 APK first."
  exit 1
}

adb -s emulator-5554 reverse tcp:19000 tcp:19000
adb -s emulator-5554 reverse tcp:19001 tcp:19001
adb -s emulator-5554 reverse tcp:8081 tcp:8081

Write-Host "Starting Metro..."
Start-Process cmd.exe -ArgumentList "/c","set NODE_OPTIONS=--openssl-legacy-provider&& set CI=1&& npx --no-install expo-cli start --lan --non-interactive --port 19000" -WorkingDirectory $PSScriptRoot

Start-Sleep -Seconds 12
adb -s emulator-5554 shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:19000" host.exp.exponent
Write-Host "Opened Melting Solution in Expo Go on the emulator."
