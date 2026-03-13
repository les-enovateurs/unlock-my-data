import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CleanUpProvider, useCleanUpContext } from "@/context/CleanUpContext";

function CleanUpContextProbe() {
  const {
    selectedServiceIds,
    setSelectedServiceIds,
    usedVolumes,
    savedVolumes,
    getOrderedSuites,
    getNextRoute
  } = useCleanUpContext();

  return (
    <div>
      <button
        type="button"
        onClick={() => setSelectedServiceIds(["gmail", "google-drive", "onedrive", "discord"])}
      >
        select-main
      </button>
      <div data-testid="selected">{selectedServiceIds.join(",")}</div>
      <div data-testid="ordered">{getOrderedSuites().map((suite) => suite.id).join(",")}</div>
      <div data-testid="used">{JSON.stringify(usedVolumes)}</div>
      <div data-testid="saved">{JSON.stringify(savedVolumes)}</div>
      <div data-testid="route-audit-google">{getNextRoute("audit", "google") ?? "null"}</div>
      <div data-testid="route-clean-google">{getNextRoute("clean", "google") ?? "null"}</div>
      <div data-testid="route-clean-discord">{getNextRoute("clean", "discord") ?? "null"}</div>
      <div data-testid="route-clean-unknown">{getNextRoute("clean", "unknown") ?? "null"}</div>
    </div>
  );
}

describe("CleanUpContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("groups selected services into ordered suites and computes next routes", async () => {
    render(
      <CleanUpProvider>
        <CleanUpContextProbe />
      </CleanUpProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "select-main" }));

    await waitFor(() => {
      expect(screen.getByTestId("ordered").textContent).toBe("google,microsoft,discord");
    });

    expect(screen.getByTestId("route-audit-google").textContent).toBe("/digital-clean-up/clean/google");
    expect(screen.getByTestId("route-clean-google").textContent).toBe("/digital-clean-up/audit/microsoft");
    expect(screen.getByTestId("route-clean-discord").textContent).toBe("/digital-clean-up/recap");
    expect(screen.getByTestId("route-clean-unknown").textContent).toBe("/digital-clean-up");
  });

  it("hydrates from localStorage and removes stale used/saved volumes", async () => {
    localStorage.setItem("digitalCleanUp_selected", JSON.stringify(["gmail"]));
    localStorage.setItem(
      "digitalCleanUp_usedVolumes",
      JSON.stringify({
        gmail: "3",
        google: "9",
        discord: "100"
      })
    );
    localStorage.setItem(
      "digitalCleanUp_savedVolumes",
      JSON.stringify({
        gmail: 1.5,
        discord: 22
      })
    );

    render(
      <CleanUpProvider>
        <CleanUpContextProbe />
      </CleanUpProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected").textContent).toBe("gmail");
    });

    await waitFor(() => {
      const used = JSON.parse(screen.getByTestId("used").textContent || "{}");
      const saved = JSON.parse(screen.getByTestId("saved").textContent || "{}");

      expect(used).toEqual({ gmail: "3", google: "9" });
      expect(saved).toEqual({ gmail: 1.5 });
    });
  });
});
