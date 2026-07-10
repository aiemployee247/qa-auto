/**
 * AStream — Login (scaffold)
 * Jira: ASTREAM-2 — Xray TC-1 / TC-2
 */
describe('ASTREAM-2: Login', () => {
  before(function () {
    const hasApp =
      process.env.ASTREAM_ANDROID_APP ||
      process.env.ASTREAM_IOS_APP ||
      process.env.ASTREAM_SAUCE_APP;
    if (!hasApp) {
      this.skip();
    }
  });

  it('TC-1: invalid credentials show an error and do not sign in', async () => {
    const { AStreamLoginPage } = await import('../pages/LoginPage');
    const { AStreamHomePage } = await import('../pages/HomePage');

    const login = new AStreamLoginPage(browser);
    const home = new AStreamHomePage(browser);

    await login.waitForReady();
    await login.login('wrong-user@test.local', 'definitely-wrong');
    await expect(login.errorMessage).toBeDisplayed();
    await expect(home.screen).not.toBeDisplayed();
  });

  it('TC-2: valid credentials sign in and show home', async () => {
    const { AStreamLoginPage } = await import('../pages/LoginPage');
    const { AStreamSignUpPage } = await import('../pages/SignUpPage');
    const { AStreamHomePage } = await import('../pages/HomePage');

    const login = new AStreamLoginPage(browser);
    const signup = new AStreamSignUpPage(browser);
    const home = new AStreamHomePage(browser);

    const email = `astream.login.${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    await login.waitForReady();
    await login.openSignUp();
    await signup.waitForReady();
    await signup.signUp('Login Tester', email, password);
    await home.waitForReady();
    await home.logout();

    await login.waitForReady();
    await login.login(email, password);
    await home.waitForReady();
    await expect(home.userEmail).toHaveText(email);
  });
});
