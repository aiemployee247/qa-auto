/**
 * GStream — Login validation + happy path
 * Flow: Welcome → Sign in → (signup setup) → Log out → Continue → Dashboard
 * Jira: GSTREAM-2 — Xray TC-1 / TC-2
 */
describe('GSTREAM-2: Login', () => {
  it('TC-1: invalid credentials show an error and do not sign in', async () => {
    const { GStreamWelcomePage } = await import('../pages/WelcomePage');
    const { GStreamLoginPage } = await import('../pages/LoginPage');
    const { GStreamHomePage } = await import('../pages/HomePage');

    const welcome = new GStreamWelcomePage(browser);
    const login = new GStreamLoginPage(browser);
    const home = new GStreamHomePage(browser);

    if (await welcome.isShowing()) {
      await welcome.getStarted();
    }

    await login.waitForReady();
    await expect(login.emailInput).toBeExisting();
    await expect(login.passwordInput).toBeExisting();
    await expect(login.submitButton).toBeExisting();

    await login.login('wrong-user@test.local', 'definitely-wrong');

    await expect(login.errorMessage).toBeDisplayed();
    await expect(home.heading).not.toBeExisting();
  });

  it('TC-2: valid credentials sign in and show dashboard', async () => {
    const { GStreamLoginPage } = await import('../pages/LoginPage');
    const { GStreamSignUpPage } = await import('../pages/SignUpPage');
    const { GStreamHomePage } = await import('../pages/HomePage');

    const login = new GStreamLoginPage(browser);
    const signup = new GStreamSignUpPage(browser);
    const home = new GStreamHomePage(browser);

    const firstName = 'Login';
    const lastName = 'Tester';
    const email = `gstream.login.${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    await login.waitForReady();
    await login.openSignUp();
    await signup.waitForReady();
    await signup.signUp({
      firstName,
      lastName,
      email,
      password,
      confirmPassword: password,
      birthMonth: '07',
      birthDay: '04',
      birthYear: '1990',
    });
    await home.waitForReady();
    await home.logout();

    // Logout returns to Welcome — dismiss again into Sign in
    await login.waitForReady();
    await expect(login.submitButton).toBeExisting();
    await login.login(email, password);

    await home.waitForReady();
    await expect(home.heading).toBeExisting();
    await expect(home.userName).toHaveText(`${firstName} ${lastName}`);
    await expect(home.userEmail).toHaveText(email);
    await expect(home.dashboardTab).toBeExisting();
    await expect(home.profileTab).toBeExisting();
  });
});
