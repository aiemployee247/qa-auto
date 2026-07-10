# GStream (native) — Appium

Login + signup automation for the React Native GStream app (`com.gstream.auth`).

## Specs

| Spec | Case |
|---|---|
| `GSTREAM-1-TC-1` | Sign up → home |
| `GSTREAM-2-TC-1` | Invalid login shows error |
| `GSTREAM-2-TC-2` | Valid login after signup |

Selectors use React Native `testID`s (`~login-email`, `~signup-submit`, …).

## Local binaries

Put builds here (gitignored) or set env paths:

```
apps/gstream/android/app-debug.apk
apps/gstream/ios/GStream.app   # simulator .app is fine for local Appium
```

```bash
# From the GStream app repo (example):
# npx expo prebuild --platform android
# cd android && ./gradlew assembleDebug
# cp app/build/outputs/apk/debug/app-debug.apk ../qa-auto/apps/gstream/android/

cp /path/to/app-debug.apk apps/gstream/android/app-debug.apk
```

## Run (local)

```bash
# Terminal 1 — Appium server
npm run appium

# Terminal 2 — Android emulator must be running
npm run test:gstream:android

# iOS simulator must be booted
npm run test:gstream:ios
```

## Sauce Labs (next)

```bash
export APPIUM_PROVIDER=sauce
export SAUCE_USERNAME=...
export SAUCE_ACCESS_KEY=...
export GSTREAM_SAUCE_APP=storage:filename=gstream.apk   # after sauce storage upload
npm run test:gstream:android
```
