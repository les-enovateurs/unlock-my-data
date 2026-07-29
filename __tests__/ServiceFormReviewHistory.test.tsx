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

jest.mock("@mdxeditor/editor", () => ({
  __esModule: true,
  MDXEditor: ({ markdown }: { markdown: string }) => <div>{markdown}</div>,
  headingsPlugin: jest.fn(),
  listsPlugin: jest.fn(),
  linkPlugin: jest.fn(),
  quotePlugin: jest.fn(),
  markdownShortcutPlugin: jest.fn(),
  ListsToggle: () => <div>ListsToggle</div>,
  linkDialogPlugin: jest.fn(),
  CreateLink: () => <div>CreateLink</div>,
  toolbarPlugin: jest.fn(),
  BoldItalicUnderlineToggles: () => <div>BoldItalicUnderlineToggles</div>,
  UndoRedo: () => <div>UndoRedo</div>,
  BlockTypeSelect: () => <div>BlockTypeSelect</div>
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
});
