# qa-auto

Cross-platform QA automation — **Playwright + Appium (WebdriverIO) + TypeScript**, maintained by Viktor (AI QA).
Specs map 1:1 to Jira tickets and Xray test cases: `projects/<platform>/tests/<TICKET>-<TC>.spec.ts`.

## Structure

```
playwright.config.ts     # browser platforms (webtv, uctv)
shared/                  # shared page objects (web + mobile)
projects/
  webtv/                 # WebTV (Playwright)
  uctv/                  # UCTV (Playwright)
  mobile-app/            # Mobile app native (Appium) — login/signup
  astream/               # AStream native (Appium)
  ios/                   # legacy manual Xray notes
apps/                    # local APK / IPA / .app binaries (gitignored)
.github/workflows/       # CI
```

## Running locally (web)

```bash
npm install
npx playwright install chromium
cp .env.example .env

npm test                 # Playwright platforms
npm run test:webtv
npm run report
```

## Running locally (native Appium)

```bash
# Install Appium drivers once
npx appium driver install uiautomator2
npx appium driver install xcuitest

# Put binaries in apps/ (or set paths in .env)
# Prefer a release/offline APK so the app does not wait on Metro:
#   apps/mobile-app/android/app-release.apk
#   apps/mobile-app/ios/GStream.app   # simulator .app for now; IPA later for Sauce

# Terminal 1
npm run appium

# Terminal 2 — emulator/simulator must be running
npm run test:mobile-app:android
npm run test:mobile-app:ios
```

### Sauce Labs (next)

1. Upload the APK/IPA to Sauce Storage.
2. In `.env`:
   - `APPIUM_PROVIDER=sauce`
   - `SAUCE_USERNAME` / `SAUCE_ACCESS_KEY`
   - `MOBILE_APP_SAUCE_APP=storage:filename=gstream.apk` (or the returned storage id)
   - optional: `SAUCE_DEVICE_NAME`, `SAUCE_PLATFORM_VERSION`, `SAUCE_BUILD`
3. Run the same npm scripts (`test:mobile-app:android` / `test:mobile-app:ios`).

## Conventions

- **Selectors:** prefer `getByRole` / `getByTestId` / labels (web) and React Native `testID` → `~id` (Appium).
- **Naming:** one spec file per Jira ticket, one `test()` / `it()` per Xray case (`TC-n` in the title).
- **Environments:** URLs, credentials, and app paths come from `.env`. Never hardcode secrets.

## Current tests

| Spec | Platform | Case |
|---|---|---|
| `projects/webtv/tests/DEMO-2-TC-1.spec.ts` | WebTV | invalid login |
| `projects/mobile-app/tests/MOBILE-APP-1-TC-1.spec.ts` | Mobile App | signup → home |
| `projects/mobile-app/tests/MOBILE-APP-2-TC-1.spec.ts` | Mobile App | login invalid + valid |
| `projects/astream/tests/*` | AStream | login/signup |
