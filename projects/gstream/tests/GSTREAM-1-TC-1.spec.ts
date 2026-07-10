/**
 * GStream — Signup happy path
 * Jira: GSTREAM-1 — Xray TC-1
 */
describe('GSTREAM-1: Sign up', () => {
  it('TC-1: create account and land on home', async () => {
    const { GStreamLoginPage } = await import('../pages/LoginPage');
    const { GStreamSignUpPage } = await import('../pages/SignUpPage');
    const { GStreamHomePage } = await import('../pages/HomePage');

    const login = new GStreamLoginPage(browser);
    const signup = new GStreamSignUpPage(browser);
    const home = new GStreamHomePage(browser);

    const email = `gstream.user.${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    await login.waitForReady();
    await login.openSignUp();
    await signup.waitForReady();
    await signup.signUp('GStream Tester', email, password);

    await home.waitForReady();
    await expect(home.userName).toHaveText('GStream Tester');
    await expect(home.userEmail).toHaveText(email);
  });
});
