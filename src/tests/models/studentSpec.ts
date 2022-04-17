import { makeStudentStore, makeUserStore, Student } from "../../models";

const studentStore = makeStudentStore();

const userStore = makeUserStore();

describe("Student Model Suite", () => {
  let user: { id: number; username: string };
  let student: Student;
  beforeAll(async () => {
    user = await userStore.createUser("test-student", "pass123");
  });

  it("Adds a student", async () => {
    student = await studentStore.add({ id: user.id, name: "Khaled" });
    expect(student.id).toBeDefined();
  });

  it("Fails to add a student if id is redundant", async () => {
    await expectAsync(
      studentStore.add({ id: user.id, name: "Khaled" })
    ).toBeRejected();
  });

  it("Lists students", async () => {
    const students = await studentStore.index();
    expect(students.length).toBeGreaterThanOrEqual(1);
  });

  it("Updates a student", async () => {
    const updatedStudent = await studentStore.update({
      id: student.id,
      name: "Mohamed",
    });
    expect(updatedStudent.name).toBe("Mohamed");
  });

  it("Gets a student", async () => {
    const getStudent = await studentStore.get(student.id);

    expect(getStudent.id).toBe(student.id);
  });

  it("Deletes a student", async () => {
    await studentStore.remove(student.id);
  });
});
