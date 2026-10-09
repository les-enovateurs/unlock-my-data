import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ServiceForm from "@/components/ServiceForm";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("slug=action")
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>
}));

const createGitHubPR = jest.fn(async () => "https://github.com/example/pr");

jest.mock("@/tools/github", () => ({
  createGitHubPR: (...args: unknown[]) => createGitHubPR(...args),
  generateSlug: (name: string) => name.toLowerCase().replace(/\s+/g, "-")
}));

jest.mock("@/lib/notifications/mattermost", () => ({
  notifyPublished: jest.fn(async () => undefined),
  notifyReview: jest.fn(async () => undefined),
  notifyNewCard: jest.fn(async () => undefined)
}));

const reviewThread = [
  {
    field: "contact_mail_delete",
    message: "Is this address only used to withdraw consent?",
    reviewer_name: "gildas",
    timestamp: "2026-07-28T12:54:54.440Z",
    resolved: false,
    replies: []
  }
];

const storedCard = {
  name: "Test Service",
  slug: "action",
  nationality: "France",
  country_name: "France",
  country_code: "FR",
  created_by: "gildas",
  created_at: "2026-07-01",
  status: "draft",
  review: reviewThread
};

describe("ServiceForm review history", () => {
  beforeEach(() => {
    createGitHubPR.mockClear();
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (typeof url === "string" && url.includes("/data/manual/")) {
        return Promise.resolve({ ok: true, json: async () => storedCard });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    }) as unknown as typeof fetch;
  });

  // Regression: the contributor form used to reset `review` to `[]` on every
  // update, which is how a reviewer's questions vanished from a card without
  // anyone ever answering them.
  it("shows the reviewer questions carried by the card", async () => {
    render(<ServiceForm lang="en" mode="update" slug="action" />);

    expect(
      await screen.findByText("Is this address only used to withdraw consent?")
    ).toBeInTheDocument();
    // The byline carries the reviewer name and the date in a single node.
    expect(screen.getByText(/gildas/)).toBeInTheDocument();
  });

  it("blocks the update while a reviewer question has no answer", async () => {
    render(<ServiceForm lang="en" mode="update" slug="action" />);
    await screen.findByText("Is this address only used to withdraw consent?");

    const form = document.querySelector("form") as HTMLFormElement;
    fireEvent.submit(form);

    // The panel banner and the submit error both name the pending question.
    await waitFor(() =>
      expect(screen.getAllByText(/without an answer/i).length).toBeGreaterThan(1)
    );
    expect(createGitHubPR).not.toHaveBeenCalled();
  });

  // Regression (PR #390): an edit flipped a published fiche to draft, which
  // drops it from the public site, and rebuilt the English transfer value
  // from the country table, overwriting "Not specified" with "Non indiqué".
  it("keeps the fiche status and hand-written English transfer value", async () => {
    const published = {
      ...storedCard, status: "published", review: [],
      // Required by the form since it gained HTML validation: without them the
      // submit stops at reportValidity and the confirm modal never opens.
      logo: "/img/logos/action.webp",
      easy_access_data: 4,
      details_required_documents: "Aucun",
      transfer_destination_countries: ["Non indiqué"],
      transfer_destination_countries_en: ["Not specified"],
    };
    global.fetch = jest.fn().mockImplementation((url: string) =>
      Promise.resolve({ ok: true, json: async () => (String(url).includes("/data/manual/") ? published : []) })
    ) as unknown as typeof fetch;

    render(<ServiceForm lang="en" mode="update" slug="action" />);
    const author = await waitFor(() => {
      const el = document.querySelector('input[name="author"]') as HTMLInputElement;
      expect(el).toBeTruthy();
      return el;
    });
    fireEvent.change(author, { target: { name: "author", value: "Marco" } });
    fireEvent.submit(document.querySelector("form") as HTMLFormElement);
    fireEvent.click(await screen.findByText(/confirm/i, { selector: "button" }));

    await waitFor(() => expect(createGitHubPR).toHaveBeenCalled());
    const written = JSON.parse((createGitHubPR.mock.calls[0] as unknown[])[2] as string);
    expect(written.status).toBe("published");
    expect(written.transfer_destination_countries).toEqual(["Non indiqué"]);
    expect(written.transfer_destination_countries_en).toEqual(["Not specified"]);
  });
});
