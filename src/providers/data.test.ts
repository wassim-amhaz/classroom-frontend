import { describe, expect, it } from "vitest";
import { dataProvider } from "./data";
import { MOCK_SUBJECTS } from "@/constants";

describe("mock dataProvider (src/providers/data.ts)", () => {
  describe("getList", () => {
    it("returns all mock subjects and the correct total when resource is 'subjects'", async () => {
      const result = await dataProvider.getList({ resource: "subjects" });

      expect(result.total).toBe(MOCK_SUBJECTS.length);
      expect(result.data).toEqual(MOCK_SUBJECTS);
    });

    it("returns an empty list and total 0 for any other resource", async () => {
      const result = await dataProvider.getList({ resource: "unknown" });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("is case-sensitive and does not match a differently-cased resource name", async () => {
      const result = await dataProvider.getList({ resource: "Subjects" });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("ignores pagination/filter/sorter params and always returns the full mock set for 'subjects'", async () => {
      const result = await dataProvider.getList({
        resource: "subjects",
        pagination: { current: 2, pageSize: 1 },
        filters: [{ field: "department", operator: "eq", value: "Physics" }],
      });

      expect(result.total).toBe(MOCK_SUBJECTS.length);
      expect(result.data).toEqual(MOCK_SUBJECTS);
    });

    it("returns the same MOCK_SUBJECTS array reference rather than a copy", async () => {
      const result = await dataProvider.getList({ resource: "subjects" });

      expect(result.data).toBe(MOCK_SUBJECTS);
    });

    it("returns an empty array (not undefined/null) for an empty resource string", async () => {
      const result = await dataProvider.getList({ resource: "" });

      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("unimplemented methods", () => {
    it("getOne throws", async () => {
      await expect(
        dataProvider.getOne?.({ resource: "subjects", id: 1 })
      ).rejects.toThrow("This function is not present in mock");
    });

    it("create throws", async () => {
      await expect(
        dataProvider.create?.({ resource: "subjects", variables: {} })
      ).rejects.toThrow("This function is not present in mock");
    });

    it("update throws", async () => {
      await expect(
        dataProvider.update?.({ resource: "subjects", id: 1, variables: {} })
      ).rejects.toThrow("This function is not present in mock");
    });

    it("deleteOne throws", async () => {
      await expect(
        dataProvider.deleteOne?.({ resource: "subjects", id: 1 })
      ).rejects.toThrow("This function is not present in mock");
    });
  });

  describe("getApiUrl", () => {
    it("returns an empty string", () => {
      expect(dataProvider.getApiUrl()).toBe("");
    });
  });
});