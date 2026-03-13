import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import ServiceSelection from "@/components/digital-clean-up/ServiceSelection";

jest.mock("@/components/tools/t", () => {
  return function Translator() {
    return {
      t: (key: string) => key
    };
  };
});

const mockedServices = [
  { slug: "gmail", name: "Gmail" },
  { slug: "google-drive", name: "Google Drive" },
  { slug: "google-maps", name: "Google Maps" },
  { slug: "discord", name: "Discord" }
];

function ServiceSelectionHarness({
  initialSelected = [],
  onNext = jest.fn()
}: {
  initialSelected?: string[];
  onNext?: () => void;
}) {
  const [selectedServices, setSelectedServices] = useState<string[]>(initialSelected);

  return (
    <>
      <ServiceSelection
        lang="fr"
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
        onNext={onNext}
      />
      <div data-testid="selected-services">{selectedServices.join(",")}</div>
    </>
  );
}

describe("ServiceSelection", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => mockedServices
    }) as unknown as typeof fetch;
  });

  it("loads cached selection and keeps only valid concerned children", async () => {
    localStorage.setItem(
      "digitalCleanUp_selected",
      JSON.stringify(["gmail", "google-maps", "unknown-service", "discord"])
    );

    render(<ServiceSelectionHarness />);

    await waitFor(() => {
      expect(screen.getByTestId("selected-services").textContent).toBe("gmail,discord");
    });
  });

  it("selects only available concerned suite children when clicking a suite", async () => {
    render(<ServiceSelectionHarness />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Google/i }));

    await waitFor(() => {
      const selected = (screen.getByTestId("selected-services").textContent || "").split(",").filter(Boolean);
      expect(selected).toEqual(["gmail", "google-drive"]);
    });
  });

  it("goes to next step on Enter when selection is not empty and focus is not an input", async () => {
    const onNext = jest.fn();

    render(<ServiceSelectionHarness initialSelected={["gmail"]} onNext={onNext} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    fireEvent.keyDown(window, { key: "Enter" });
    expect(onNext).toHaveBeenCalledTimes(1);

    const input = document.createElement("input");
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onNext).toHaveBeenCalledTimes(1);

    document.body.removeChild(input);
  });

  it("does not go to next step on Enter when no service is selected", async () => {
    const onNext = jest.fn();

    render(<ServiceSelectionHarness onNext={onNext} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    fireEvent.keyDown(window, { key: "Enter" });
    expect(onNext).not.toHaveBeenCalled();
  });
});
