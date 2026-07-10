/**
 * AStream — Signup happy path (iOS)
 * Jira: ASTREAM-1 — Xray TC-1
 */
describe('ASTREAM-1: Sign up', () => {
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
    await expect(home.userName).toHaveText('AStream Tester');
    await expect(home.userEmail).toHaveText(email);
  });
});
