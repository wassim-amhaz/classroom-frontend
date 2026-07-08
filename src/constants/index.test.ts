import { describe, expect, it } from "vitest";
import { DEPARTMENTS, DEPARTMENT_OPTIONS, MOCK_SUBJECTS } from "./index";

describe("DEPARTMENTS", () => {
  it("contains the expected list of departments", () => {
    expect(DEPARTMENTS).toEqual([
      "IT",
      "HR",
      "Finance",
      "Marketing",
      "Computer Science",
      "Mathematics",
      "Physics",
    ]);
  });

  it("has no duplicate entries", () => {
    expect(new Set(DEPARTMENTS).size).toBe(DEPARTMENTS.length);
  });
});

describe("DEPARTMENT_OPTIONS", () => {
  it("derives one option per department", () => {
    expect(DEPARTMENT_OPTIONS).toHaveLength(DEPARTMENTS.length);
  });

  it("maps each department to a { value, label } pair with matching values", () => {
    DEPARTMENT_OPTIONS.forEach((option, index) => {
      expect(option).toEqual({
        value: DEPARTMENTS[index],
        label: DEPARTMENTS[index],
      });
    });
  });

  it("preserves the source order of DEPARTMENTS", () => {
    expect(DEPARTMENT_OPTIONS.map((option) => option.value)).toEqual(
      DEPARTMENTS
    );
  });
});

describe("MOCK_SUBJECTS", () => {
  it("contains exactly three mock subjects", () => {
    expect(MOCK_SUBJECTS).toHaveLength(3);
  });

  it("has unique numeric ids", () => {
    const ids = MOCK_SUBJECTS.map((subject) => subject.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(typeof id).toBe("number"));
  });

  it("includes the expected CS101 subject", () => {
    expect(MOCK_SUBJECTS).toContainEqual(
      expect.objectContaining({
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "Computer Science",
      })
    );
  });

  it("every subject has the required fields with correct types", () => {
    MOCK_SUBJECTS.forEach((subject) => {
      expect(typeof subject.id).toBe("number");
      expect(typeof subject.code).toBe("string");
      expect(typeof subject.name).toBe("string");
      expect(typeof subject.department).toBe("string");
      expect(typeof subject.description).toBe("string");
      expect(typeof subject.createdAt).toBe("string");
    });
  });

  it("every subject's department is one of the known DEPARTMENTS", () => {
    MOCK_SUBJECTS.forEach((subject) => {
      expect(DEPARTMENTS).toContain(subject.department);
    });
  });

  it("every subject's createdAt is a valid ISO date string", () => {
    MOCK_SUBJECTS.forEach((subject) => {
      expect(() => new Date(subject.createdAt)).not.toThrow();
      expect(new Date(subject.createdAt).toISOString()).toBe(
        subject.createdAt
      );
    });
  });
});