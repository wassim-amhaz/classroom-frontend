import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./App.css", () => ({}));

vi.mock("@refinedev/core", () => ({
  Refine: ({ children }: any) => <>{children}</>,
}));

vi.mock("@refinedev/devtools", () => ({
  DevtoolsPanel: () => null,
  DevtoolsProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock("@refinedev/kbar", () => ({
  RefineKbar: () => <div data-testid="refine-kbar" />,
  RefineKbarProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock("@refinedev/react-router", () => ({
  default: {},
  DocumentTitleHandler: () => <div data-testid="document-title-handler" />,
  UnsavedChangesNotifier: () => (
    <div data-testid="unsaved-changes-notifier" />
  ),
}));

vi.mock("./components/refine-ui/notification/toaster", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock(
  "./components/refine-ui/notification/use-notification-provider",
  () => ({
    useNotificationProvider: () => ({}),
  })
);

vi.mock("./components/refine-ui/theme/theme-provider", () => ({
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock("./providers/data", () => ({
  dataProvider: {},
}));

vi.mock("@/pages/dashboard.tsx", () => ({
  default: () => <div data-testid="dashboard-page">Dashboard</div>,
}));

vi.mock("@/components/refine-ui/layout/layout.tsx", () => ({
  Layout: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));

vi.mock("./pages/subjetcs/list", () => ({
  default: () => <div data-testid="subjects-list-page">SubjectsList</div>,
}));

vi.mock("@/pages/subjetcs/create.tsx", () => ({
  default: () => <div data-testid="subjects-create-page">SubjectsCreate</div>,
}));

import App from "./App";

function renderAtPath(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("App", () => {
  it("renders the Dashboard page inside the Layout at the root path", () => {
    renderAtPath("/");

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });

  it("renders the SubjectsList page at /subjects", () => {
    renderAtPath("/subjects");

    expect(screen.getByTestId("subjects-list-page")).toBeInTheDocument();
  });

  it("renders the SubjectsCreate page at /subjects/create", () => {
    renderAtPath("/subjects/create");

    expect(screen.getByTestId("subjects-create-page")).toBeInTheDocument();
  });

  it("renders the toaster, kbar, unsaved-changes notifier and document title handler alongside the routed page", () => {
    renderAtPath("/");

    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("refine-kbar")).toBeInTheDocument();
    expect(screen.getByTestId("unsaved-changes-notifier")).toBeInTheDocument();
    expect(screen.getByTestId("document-title-handler")).toBeInTheDocument();
  });
});