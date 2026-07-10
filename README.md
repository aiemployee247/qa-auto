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
  gstream/               # GStream native (Appium) — login/signup
  astream/               # AStream native (Appium) — scaffold
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

# Binaries (gitignored under apps/)
#   Android GStream: apps/gstream/android/app-release.apk
#   iOS AStream:     apps/astream/ios/AStream.app

# Terminal 1
npm run appium

# Terminal 2 — emulator/simulator must be running
npm run test:gstream:android   # GStream (Android)
npm run test:astream:ios       # AStream (iOS)
```

### Sauce Labs (next)

1. Upload the APK/IPA to Sauce Storage (`gstream.apk` / `astream.ipa`).
2. In `.env` or GitHub Actions:
   - `APPIUM_PROVIDER=sauce`
   - `SAUCE_USERNAME` / `SAUCE_ACCESS_KEY`
   - `GSTREAM_SAUCE_APP` or `ASTREAM_SAUCE_APP` (`storage:filename=...` or `storage:<id>`)
   - optional: `SAUCE_DEVICE_NAME`, `SAUCE_PLATFORM_VERSION`, `SAUCE_BUILD`
3. Local: `npm run test:gstream:android` / `npm run test:astream:ios`
4. CI (manual):
   - **GStream Android:** Actions → `GStream Android (Sauce Labs)`
   - **AStream iOS:** Actions → `AStream iOS (Sauce Labs)`  
     Uses the latest `astream.ipa` in Sauce Storage, or upload via `ipa_url` input.

## Conventions

- **Selectors:** prefer `getByRole` / `getByTestId` / labels (web) and React Native `testID` → `~id` (Appium).
- **Naming:** one spec file per Jira ticket, one `test()` / `it()` per Xray case (`TC-n` in the title).
- **Environments:** URLs, credentials, and app paths come from `.env`. Never hardcode secrets.

## Current tests

| Spec | Platform | Case |
|---|---|---|
| `projects/webtv/tests/DEMO-2-TC-1.spec.ts` | WebTV | invalid login |
| `projects/gstream/tests/GSTREAM-1-TC-1.spec.ts` | GStream | signup → home |
| `projects/gstream/tests/GSTREAM-2-TC-1.spec.ts` | GStream | login invalid + valid |
| `projects/astream/tests/*` | AStream | scaffold (needs app binary) |
