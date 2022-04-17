import { makeUserStore } from "../../models";

const userStore = makeUserStore();

describe("User Model Suite", () => {
  let user: { id: number; username: string };
  it("Creates a user", async () => {
    user = await userStore.createUser("testusername", "pass123");
    expect(user.username).toBe("testusername");
  });

  it("Gets a user", async () => {
    const test_user = await userStore.getUser("testusername");
    expect(test_user.id).toBe(user.id);
  });
});
