/**
 * GStream — Login validation + happy path
 * Jira: GSTREAM-2 — Xray TC-1 / TC-2
 */
describe('GSTREAM-2: Login', () => {
  it('TC-1: invalid credentials show an error and do not sign in', async () => {
    const { GStreamLoginPage } = await import('../pages/LoginPage');
    const { GStreamHomePage } = await import('../pages/HomePage');

    const login = new GStreamLoginPage(browser);
    const home = new GStreamHomePage(browser);

    await login.waitForReady();
    await login.login('wrong-user@test.local', 'definitely-wrong');

    await expect(login.errorMessage).toBeDisplayed();
    await expect(home.screen).not.toBeDisplayed();
  });

  it('TC-2: valid credentials sign in and show home', async () => {
    const { GStreamLoginPage } = await import('../pages/LoginPage');
    const { GStreamSignUpPage } = await import('../pages/SignUpPage');
    const { GStreamHomePage } = await import('../pages/HomePage');

    const login = new GStreamLoginPage(browser);
    const signup = new GStreamSignUpPage(browser);
    const home = new GStreamHomePage(browser);

    const email = `gstream.login.${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    // Create account first (local storage auth)
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
