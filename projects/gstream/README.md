# GStream (native) — Appium

Login + signup automation for the React Native GStream app (`com.gstream.auth`).

## Flow under test

```
Welcome → Sign in (Continue) → Create Account (Register)
       → Dashboard tab / Profile tab
```

## Specs

| Spec | Case |
|---|---|
| `GSTREAM-1-TC-1` | Welcome → Create Account → Dashboard + Profile |
| `GSTREAM-2-TC-1` | Invalid login shows error |
| `GSTREAM-2-TC-2` | Valid login after signup (same file as TC-1) |

## Page objects

| Page | Covers |
|---|---|
| `WelcomePage` | `welcome-screen`, Get Started / SKIP |
| `LoginPage` | Sign in — email, password, Continue, Sign Up link |
| `SignUpPage` | Create Account — first/last, email, password + confirm, birthdate, opt-ins, Register |
| `HomePage` | Dashboard (`home-*`) + Profile tab + bottom tabs |

Selectors use React Native `testID`s (`login-email`, `signup-submit`, `tab-profile`, …).

## Local binaries

Put builds here (gitignored) or set env paths:

```
apps/gstream/android/app-release.apk
apps/gstream/ios/GStream.app
```

```bash
# From the GStream app repo:
# cd android && ./gradlew assembleRelease
# cp app/build/outputs/apk/release/app-release.apk ../qa-auto/apps/gstream/android/
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

## Sauce Labs

```bash
export APPIUM_PROVIDER=sauce
export SAUCE_USERNAME=...
export SAUCE_ACCESS_KEY=...
export GSTREAM_SAUCE_APP=storage:filename=gstream.apk
npm run test:gstream:android
```
