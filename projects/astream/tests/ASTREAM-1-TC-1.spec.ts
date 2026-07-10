/**
 * AStream — Signup happy path (scaffold)
 * Jira: ASTREAM-1 — Xray TC-1
 *
 * Skips until ASTREAM_ANDROID_APP / ASTREAM_IOS_APP (or Sauce app) is configured.
 */
describe('ASTREAM-1: Sign up', () => {
  before(function () {
    const hasApp =
      process.env.ASTREAM_ANDROID_APP ||
      process.env.ASTREAM_IOS_APP ||
      process.env.ASTREAM_SAUCE_APP;
    if (!hasApp) {
      this.skip();
    }
  });

  it('TC-1: create account and land on home', async () => {
    const { AStreamLoginPage } = await import('../pages/LoginPage');
    const { AStreamSignUpPage } = await import('../pages/SignUpPage');
    const { AStreamHomePage } = await import('../pages/HomePage');

    const login = new AStreamLoginPage(browser);
    const signup = new AStreamSignUpPage(browser);
    const home = new AStreamHomePage(browser);

    const email = `astream.user.${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    await login.waitForReady();
    await login.openSignUp();
    await signup.waitForReady();
    await signup.signUp('AStream Tester', email, password);
    await home.waitForReady();
    await expect(home.userEmail).toHaveText(email);
  });
});
