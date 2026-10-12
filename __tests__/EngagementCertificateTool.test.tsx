import { render, screen } from "@testing-library/react";
import EngagementCertificateTool from "@/components/contributors/EngagementCertificateTool";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("")
}));

jest.mock("@/components/tools/t", () => {
  return function Translator() {
    return {
      t: (key: string) => key
    };
  };
});

jest.mock("@/lib/contributorEngagement", () => ({
  getContributorNames: () => ["Alice"],
  getEngagementReport: () => ({
    contributorName: "Alice",
    created: [],
    updated: [],
    reviewed: [],
    reported: [{ company: "Demo Service", date: "2026-10-10", type: "reported" }],
    total: 1,
    monthlyActivity: [{ month: "2026-10", count: 1 }]
  })
}));

describe("EngagementCertificateTool", () => {
  it("renders reported activities with reported label and danger chip", () => {
    render(<EngagementCertificateTool lang="en" />);

    const reportedLabel = screen.getByText("typeReported");
    expect(reportedLabel).toBeInTheDocument();
    expect(reportedLabel.closest("span")).toHaveClass("umd-chip-danger");
  });
});
