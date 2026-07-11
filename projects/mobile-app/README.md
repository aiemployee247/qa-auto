# Mobile App (native) — Appium

Login + signup automation for the React Native mobile app
(Android brand build: `com.gstream.auth`).

## Flow under test

```
Welcome → Sign in (Continue) → Create Account (Register)
       → Dashboard tab / Profile tab
```

## Specs

| Spec | Case |
|---|---|
| `MOBILE-APP-1-TC-1` | Welcome → Create Account → Dashboard + Profile |
| `MOBILE-APP-2-TC-1` | Invalid login shows error |
| `MOBILE-APP-2-TC-2` | Valid login after signup (same file as TC-1) |

## Page objects

| Page | Covers |
|---|---|
| `WelcomePage` | `welcome-screen`, Get Started / SKIP |
| `LoginPage` | Sign in — email, password, Continue, Sign Up link |
| `SignUpPage` | Create Account — first/last, email, password + confirm, Register |
| `HomePage` | Dashboard (`home-*`) + Profile tab + bottom tabs |

Selectors use React Native `testID`s (`login-email`, `signup-submit`, `tab-profile`, …).

## Local binaries

```
apps/mobile-app/android/app-release.apk
apps/mobile-app/ios/GStream.app
```

## Run (local)

```bash
npm run appium
npm run test:mobile-app:android
npm run test:mobile-app:ios
```

## Sauce Labs

```bash
export APPIUM_PROVIDER=sauce
export SAUCE_USERNAME=...
export SAUCE_ACCESS_KEY=...
export MOBILE_APP_SAUCE_APP=storage:filename=gstream.apk
npm run test:mobile-app:android
```
