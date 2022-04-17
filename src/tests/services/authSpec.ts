import { JwtPayload } from "jsonwebtoken";
import { makeAuthService } from "../../services/auth";

const authService = makeAuthService();

describe("Auth Service Suite", () => {
  let token: string;
  it("Creates an account", async () => {
    const user = await authService.createAccount(
      "test-account",
      "pass123",
      "Test User",
      "instructor"
    );
    token = user.token;
    expect(user.username).toBe("test-account");
    expect(user.token).toBeDefined();
  });

  it("Logs in", async () => {
    const user = await authService.login("test-account", "pass123");
    expect(user.token).toBeDefined();
    expect(user.username).toBe("test-account");
  });

  it("Fails to log in if username is invalid", async () => {
    await expectAsync(
      authService.login("wrong-username", "pass123")
    ).toBeRejected();
  });

  it("Verifies a token", () => {
    const { username } = authService.verify(token) as JwtPayload;
    expect(username).toBe("test-account");
  });

  it("Fails to verify a token if invalid", async () => {
    expect(() => authService.verify(token.slice(5))).toThrow();
  });
});
