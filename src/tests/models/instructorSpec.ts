import { makeInstructorStore, makeUserStore, Student } from "../../models";

const instructorStore = makeInstructorStore();

const userStore = makeUserStore();

describe("Instructor Model Suite", () => {
  let user: { id: number; username: string };
  let instructor: { id: number; name: string };
  beforeAll(async () => {
    user = await userStore.createUser("test-instructor", "pass123");
  });

  it("Adds an instructor", async () => {
    instructor = await instructorStore.add({
      id: user.id,
      name: "Mr Instructor",
    });
    expect(instructor.id).toBeDefined();
  });

  it("Lists instructors", async () => {
    const instructors = await instructorStore.index();
    expect(instructors.length).toBeGreaterThanOrEqual(1);
  });

  it("Updates an instructor", async () => {
    const updatedInstructor = await instructorStore.update({
      id: instructor.id,
      name: "Mr Updated Instructor",
    });
    expect(updatedInstructor.name).toBe("Mr Updated Instructor");
  });

  it("Gets an instructor", async () => {
    const getInstructor = await instructorStore.get(instructor.id);

    expect(getInstructor.id).toBe(instructor.id);
  });

  it("Deletes an instructor", async () => {
    await instructorStore.remove(instructor.id);
  });
});
