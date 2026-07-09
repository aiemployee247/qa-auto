# iOS (native)

Native iOS flows are covered by **manual Xray test cases** (e.g. AS-5…AS-9
for AS-2) rather than Playwright — browser automation can't drive the native
app, and AV/DRM behavior needs a real device.

If device automation becomes worthwhile later, this folder is the home for
an Appium/XCUITest setup wired into the same CI workflow.
