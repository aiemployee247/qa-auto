# AStream (native) — Appium

Login + signup automation for the React Native AStream app (`com.astream.auth` on iOS).

## Flow under test

```
Welcome → Sign in (Continue) → Create Account (Register)
       → Dashboard tab / Profile tab
```

## Specs

| Spec | Case |
|---|---|
| `ASTREAM-1-TC-1` | Welcome → Create Account → Dashboard + Profile |
| `ASTREAM-2-TC-1` | Invalid login shows error |
| `ASTREAM-2-TC-2` | Valid login after signup (same file as TC-1) |

## Page objects

| Page | Covers |
|---|---|
| `WelcomePage` | `welcome-screen`, Get Started / SKIP |
| `LoginPage` | Sign in — email, password, Continue, Sign Up link |
| `SignUpPage` | Create Account — first/last, email, password + confirm, birthdate, opt-ins, Register |
| `HomePage` | Dashboard (`home-*`) + Profile tab + bottom tabs |

## Local binaries

```
apps/astream/android/app-release.apk
apps/astream/ios/AStream.app
```

```bash
# Terminal 1 — Appium server
npm run appium

# Terminal 2
npm run test:astream:android
npm run test:astream:ios
```

## Sauce Labs

```bash
export APPIUM_PROVIDER=sauce
export SAUCE_USERNAME=...
export SAUCE_ACCESS_KEY=...
export ASTREAM_SAUCE_APP=storage:filename=astream.app.zip
npm run test:astream:ios
```
