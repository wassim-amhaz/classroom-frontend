import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockDataProvider, mockKyInstance, createSimpleRestDataProviderMock } =
  vi.hoisted(() => {
    const mockDataProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteOne: vi.fn(),
      getApiUrl: vi.fn(),
    };
    const mockKyInstance = { get: vi.fn(), post: vi.fn() };
    const createSimpleRestDataProviderMock = vi.fn(() => ({
      dataProvider: mockDataProvider,
      kyInstance: mockKyInstance,
    }));

    return {
      mockDataProvider,
      mockKyInstance,
      createSimpleRestDataProviderMock,
    };
  });

vi.mock("@refinedev/rest/simple-rest", () => ({
  createSimpleRestDataProvider: createSimpleRestDataProviderMock,
}));

describe("REST dataProvider wiring (src/providerss/data.ts)", () => {
  beforeEach(() => {
    vi.resetModules();
    createSimpleRestDataProviderMock.mockClear();
  });

  it("creates the simple REST data provider using API_URL from constants", async () => {
    const { API_URL } = await import("./constants");
    await import("./data");

    expect(createSimpleRestDataProviderMock).toHaveBeenCalledTimes(1);
    expect(createSimpleRestDataProviderMock).toHaveBeenCalledWith({
      apiURL: API_URL,
    });
  });

  it("re-exports the dataProvider and kyInstance produced by the factory", async () => {
    const { dataProvider, kyInstance } = await import("./data");

    expect(dataProvider).toBe(mockDataProvider);
    expect(kyInstance).toBe(mockKyInstance);
  });
});