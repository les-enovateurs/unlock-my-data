import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CleanUpProvider, useCleanUpContext, useCurrentSuite } from "@/context/CleanUpContext";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace })
}));

function CurrentSuiteProbe({ suiteId }: { suiteId: string }) {
  const suite = useCurrentSuite(suiteId);
  return <div data-testid="current">{suite?.id ?? "none"}</div>;
}

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
    mockReplace.mockClear();
  });

  it("redirects from an unknown suite to the first selected one, outside render", async () => {
    localStorage.setItem("digitalCleanUp_selected", JSON.stringify(["gmail"]));

    render(
      <CleanUpProvider lang="fr">
        <CurrentSuiteProbe suiteId="unknown" />
      </CleanUpProvider>
    );

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/nettoyage-numerique/audit/google"));
    expect(screen.getByTestId("current").textContent).toBe("none");
  });

  it("does not redirect from a selected suite once storage is loaded", async () => {
    localStorage.setItem("digitalCleanUp_selected", JSON.stringify(["gmail"]));

    render(
      <CleanUpProvider lang="en">
        <CurrentSuiteProbe suiteId="google" />
      </CleanUpProvider>
    );

    await waitFor(() => expect(screen.getByTestId("current").textContent).toBe("google"));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("groups selected services into ordered suites and computes next routes", async () => {
    render(
      <CleanUpProvider lang="en">
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

  it("routes the French journey under /nettoyage-numerique", async () => {
    render(
      <CleanUpProvider lang="fr">
        <CleanUpContextProbe />
      </CleanUpProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "select-main" }));

    await waitFor(() => {
      expect(screen.getByTestId("route-audit-google").textContent).toBe("/nettoyage-numerique/clean/google");
    });
    expect(screen.getByTestId("route-clean-unknown").textContent).toBe("/nettoyage-numerique");
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
      <CleanUpProvider lang="en">
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
