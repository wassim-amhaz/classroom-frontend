import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEPARTMENT_OPTIONS } from "@/constants";

const { useTableMock } = vi.hoisted(() => {
  return {
    useTableMock: vi.fn((config: any) => ({
      __config: config,
      reactTable: {},
      refineCore: {},
    })),
  };
});

vi.mock("@refinedev/react-table", () => ({
  useTable: (config: any) => useTableMock(config),
}));

vi.mock("@/components/refine-ui/layout/breadcrumb.tsx", () => ({
  Breadcrumb: () => <div data-testid="breadcrumb" />,
}));

vi.mock("@/components/refine-ui/buttons/create.tsx", () => ({
  CreateButton: () => <button data-testid="create-button">Create</button>,
}));

vi.mock("@/components/refine-ui/data-table/data-table.tsx", () => ({
  DataTable: () => <div data-testid="data-table" />,
}));

vi.mock("@/components/ui/select.tsx", () => ({
  Select: ({ value, onValueChange, children }: any) => (
    <div data-testid="select-mock" data-value={value}>
      {children}
      <button
        data-testid="select-change-math"
        onClick={() => onValueChange("Mathematics")}
      >
        change-to-math
      </button>
      <button
        data-testid="select-change-all"
        onClick={() => onValueChange("all")}
      >
        change-to-all
      </button>
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
}));

import SubjectsList from "./list";

function lastCallConfig() {
  return useTableMock.mock.calls[useTableMock.mock.calls.length - 1][0];
}

describe("SubjectsList", () => {
  beforeEach(() => {
    useTableMock.mockClear();
  });

  it("renders the page title, intro copy, breadcrumb, create button and data table", () => {
    render(<SubjectsList />);

    expect(
      screen.getByRole("heading", { name: "Subjects" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Quick access to essential metrics and management tools")
    ).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("create-button")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("calls useTable with the 'subjects' resource, server-side pagination and default desc sort by id", () => {
    render(<SubjectsList />);

    const config = lastCallConfig();
    expect(config.refineCoreProps.resource).toBe("subjects");
    expect(config.refineCoreProps.pagination).toEqual({
      pageSize: 10,
      mode: "server",
    });
    expect(config.refineCoreProps.sorters.initial).toEqual([
      { field: "id", order: "desc" },
    ]);
  });

  it("has no permanent filters by default", () => {
    render(<SubjectsList />);

    expect(lastCallConfig().refineCoreProps.filters.permanent).toEqual([]);
  });

  it("adds a 'contains' name filter when the user types into the search field", async () => {
    const user = userEvent.setup();
    render(<SubjectsList />);

    const input = screen.getByPlaceholderText("Search by name");
    await user.type(input, "calc");

    expect(lastCallConfig().refineCoreProps.filters.permanent).toEqual([
      { field: "name", operator: "contains", value: "calc" },
    ]);
  });

  it("adds an 'eq' department filter when a department is selected", () => {
    render(<SubjectsList />);

    fireEvent.click(screen.getByTestId("select-change-math"));

    expect(lastCallConfig().refineCoreProps.filters.permanent).toEqual([
      { field: "department", operator: "eq", value: "Mathematics" },
    ]);
  });

  it("clears the department filter when 'all' is selected again", () => {
    render(<SubjectsList />);

    fireEvent.click(screen.getByTestId("select-change-math"));
    fireEvent.click(screen.getByTestId("select-change-all"));

    expect(lastCallConfig().refineCoreProps.filters.permanent).toEqual([]);
  });

  it("removes the search filter again when the search field is cleared", async () => {
    const user = userEvent.setup();
    render(<SubjectsList />);

    const input = screen.getByPlaceholderText("Search by name");
    await user.type(input, "calc");
    expect(lastCallConfig().refineCoreProps.filters.permanent).toEqual([
      { field: "name", operator: "contains", value: "calc" },
    ]);

    await user.clear(input);

    expect(lastCallConfig().refineCoreProps.filters.permanent).toEqual([]);
  });

  it("combines the department and search filters when both are set", async () => {
    const user = userEvent.setup();
    render(<SubjectsList />);

    fireEvent.click(screen.getByTestId("select-change-math"));
    const input = screen.getByPlaceholderText("Search by name");
    await user.type(input, "algebra");

    expect(lastCallConfig().refineCoreProps.filters.permanent).toEqual([
      { field: "department", operator: "eq", value: "Mathematics" },
      { field: "name", operator: "contains", value: "algebra" },
    ]);
  });

  it("renders the 'All departments' option plus one option per known department", () => {
    render(<SubjectsList />);

    expect(screen.getByTestId("select-item-all")).toHaveTextContent(
      "All departments"
    );
    DEPARTMENT_OPTIONS.forEach((department) => {
      expect(
        screen.getByTestId(`select-item-${department.value}`)
      ).toHaveTextContent(department.label);
    });
  });

  describe("column definitions", () => {
    let columns: any[];

    beforeEach(() => {
      render(<SubjectsList />);
      columns = lastCallConfig().columns;
    });

    it("defines a 'code' column sized 100 that renders a Badge with the raw value", () => {
      const codeColumn = columns.find((c) => c.id === "code");
      expect(codeColumn.accessorKey).toBe("code");
      expect(codeColumn.size).toBe(100);

      const header = render(<>{codeColumn.header()}</>);
      expect(header.getByText("Code")).toBeInTheDocument();
      header.unmount();

      const cell = render(<>{codeColumn.cell({ getValue: () => "CS101" })}</>);
      expect(cell.getByText("CS101")).toBeInTheDocument();
      cell.unmount();
    });

    it("defines a 'name' column using the includesString filter and plain text rendering", () => {
      const nameColumn = columns.find((c) => c.id === "name");
      expect(nameColumn.accessorKey).toBe("name");
      expect(nameColumn.filterFn).toBe("includesString");

      const header = render(<>{nameColumn.header()}</>);
      expect(header.getByText("Name")).toBeInTheDocument();
      header.unmount();

      const cell = render(
        <>{nameColumn.cell({ getValue: () => "Calculus II" })}</>
      );
      expect(cell.getByText("Calculus II")).toHaveClass("text-foreground");
      cell.unmount();
    });

    it("defines a 'department' column that renders a secondary Badge", () => {
      const departmentColumn = columns.find((c) => c.id === "department");
      expect(departmentColumn.accessorKey).toBe("department");

      const header = render(<>{departmentColumn.header()}</>);
      expect(header.getByText("Department")).toBeInTheDocument();
      header.unmount();

      const cell = render(
        <>{departmentColumn.cell({ getValue: () => "Physics" })}</>
      );
      expect(cell.getByText("Physics")).toBeInTheDocument();
      cell.unmount();
    });

    it("defines a 'description' column that truncates long text", () => {
      const descriptionColumn = columns.find((c) => c.id === "description");
      expect(descriptionColumn.accessorKey).toBe("description");

      const header = render(<>{descriptionColumn.header()}</>);
      expect(header.getByText("Description")).toBeInTheDocument();
      header.unmount();

      const cell = render(
        <>{descriptionColumn.cell({ getValue: () => "Some long text" })}</>
      );
      expect(cell.getByText("Some long text")).toHaveClass(
        "truncate",
        "line-clamp-2"
      );
      cell.unmount();
    });
  });
});