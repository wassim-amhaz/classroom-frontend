import { describe, expect, expectTypeOf, it } from "vitest";
import { MOCK_SUBJECTS } from "@/constants";
import type { Subject } from "./index";

describe("Subject type", () => {
  it("accepts an object with exactly the expected shape", () => {
    const subject: Subject = {
      id: 1,
      name: "Introduction to Computer Science",
      code: "CS101",
      description: "Fundamental concepts of programming.",
      department: "Computer Science",
      createdAt: new Date().toISOString(),
    };

    expectTypeOf(subject).toEqualTypeOf<Subject>();
    expect(subject.id).toBe(1);
  });

  it("matches the field types (id: number, others: string)", () => {
    expectTypeOf<Subject>().toHaveProperty("id").toEqualTypeOf<number>();
    expectTypeOf<Subject>().toHaveProperty("name").toEqualTypeOf<string>();
    expectTypeOf<Subject>().toHaveProperty("code").toEqualTypeOf<string>();
    expectTypeOf<Subject>()
      .toHaveProperty("description")
      .toEqualTypeOf<string>();
    expectTypeOf<Subject>()
      .toHaveProperty("department")
      .toEqualTypeOf<string>();
    expectTypeOf<Subject>()
      .toHaveProperty("createdAt")
      .toEqualTypeOf<string>();
  });

  it("is satisfied by every entry in MOCK_SUBJECTS at runtime", () => {
    const requiredKeys: (keyof Subject)[] = [
      "id",
      "name",
      "code",
      "description",
      "department",
      "createdAt",
    ];

    MOCK_SUBJECTS.forEach((subject) => {
      requiredKeys.forEach((key) => {
        expect(subject).toHaveProperty(key);
      });
    });
  });
});