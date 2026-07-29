import {
    MIN_RESOLUTION_NOTE_LENGTH,
    canCloseComment,
    closeComment,
    isExplanationRequired,
    mergeReviewHistory,
    openComments,
    reopenComment,
    unansweredComments,
} from "../reviewInvariant";
import { ReviewItem } from "../../../types/form";

const comment = (overrides: Partial<ReviewItem> = {}): ReviewItem => ({
    field: "contact_mail_delete",
    message: "Cette adresse sert-elle uniquement au retrait du consentement ?",
    reviewer_name: "gildas.kiendrebeogo",
    timestamp: "2026-07-28T12:54:54.440Z",
    resolved: false,
    replies: [],
    ...overrides,
});

describe("mergeReviewHistory", () => {
    test("keeps a stored comment the incoming payload dropped", () => {
        const stored = [comment(), comment({ field: "outside_eu_storage", timestamp: "2026-07-28T12:58:11.775Z" })];

        expect(mergeReviewHistory(stored, [])).toHaveLength(2);
        expect(mergeReviewHistory(stored, [])).toEqual(stored);
    });

    test("keeps history when the incoming payload has no review key at all", () => {
        expect(mergeReviewHistory([comment()], undefined)).toHaveLength(1);
    });

    test("applies incoming updates to a stored comment", () => {
        const stored = [comment()];
        const incoming = [comment({ resolved: true, resolved_by: "dominique_usa", resolved_note: "Confirmé par le DPO" })];

        const [merged] = mergeReviewHistory(stored, incoming);

        expect(merged.resolved).toBe(true);
        expect(merged.resolved_by).toBe("dominique_usa");
        expect(merged.resolved_note).toBe("Confirmé par le DPO");
    });

    test("allows an explicit reopen", () => {
        const stored = [comment({ resolved: true })];
        const [merged] = mergeReviewHistory(stored, [comment({ resolved: false })]);

        expect(merged.resolved).toBe(false);
    });

    test("appends comments only present in the incoming payload", () => {
        const merged = mergeReviewHistory([comment()], [
            comment(),
            comment({ field: "nationality", message: "Pays manquant", timestamp: "2026-07-29T09:00:00.000Z" }),
        ]);

        expect(merged).toHaveLength(2);
        expect(merged[1].field).toBe("nationality");
    });

    test("unions replies instead of overwriting them", () => {
        const stored = [
            comment({
                replies: [{ message: "Question transmise", author: "gildas", timestamp: "2026-07-28T13:00:00.000Z" }],
            }),
        ];
        const incoming = [
            comment({
                replies: [{ message: "Réponse du service", author: "dominique_usa", timestamp: "2026-07-29T09:00:00.000Z" }],
            }),
        ];

        const [merged] = mergeReviewHistory(stored, incoming);

        expect(merged.replies).toHaveLength(2);
        expect(merged.replies?.map((reply) => reply.author)).toEqual(["gildas", "dominique_usa"]);
    });

    test("does not duplicate a reply already stored", () => {
        const reply = { message: "Réponse", author: "dominique_usa", timestamp: "2026-07-29T09:00:00.000Z" };
        const [merged] = mergeReviewHistory([comment({ replies: [reply] })], [comment({ replies: [reply] })]);

        expect(merged.replies).toHaveLength(1);
    });

    test("survives a publish-shaped payload that stripped the review array", () => {
        const stored = [comment(), comment({ timestamp: "2026-07-28T12:58:11.775Z" })];
        const published = mergeReviewHistory(stored, []);

        expect(published).toEqual(stored);
    });
});

describe("canCloseComment", () => {
    const gateOn = { requireExplanation: true };

    test("blocks closing an unanswered comment with no note", () => {
        expect(canCloseComment(comment(), "", gateOn)).toEqual({ ok: false, reason: "note_required" });
    });

    test("blocks a whitespace-only note", () => {
        expect(canCloseComment(comment(), "   ", gateOn)).toEqual({ ok: false, reason: "note_required" });
    });

    test("blocks a note shorter than the minimum", () => {
        expect(canCloseComment(comment(), "ok", gateOn)).toEqual({ ok: false, reason: "note_too_short" });
    });

    test("accepts a note at the minimum length", () => {
        const note = "a".repeat(MIN_RESOLUTION_NOTE_LENGTH);
        expect(canCloseComment(comment(), note, gateOn)).toEqual({ ok: true });
    });

    test("accepts closing with no note when the thread already holds a reply", () => {
        const answered = comment({
            replies: [{ message: "Réponse", author: "dominique_usa", timestamp: "2026-07-29T09:00:00.000Z" }],
        });

        expect(canCloseComment(answered, "", gateOn)).toEqual({ ok: true });
    });

    test("accepts anything when the gate is disabled", () => {
        expect(canCloseComment(comment(), "", { requireExplanation: false })).toEqual({ ok: true });
    });
});

describe("isExplanationRequired", () => {
    const original = process.env.NEXT_PUBLIC_REVIEW_REQUIRE_EXPLANATION;

    afterEach(() => {
        process.env.NEXT_PUBLIC_REVIEW_REQUIRE_EXPLANATION = original;
    });

    test("is on when unset", () => {
        delete process.env.NEXT_PUBLIC_REVIEW_REQUIRE_EXPLANATION;
        expect(isExplanationRequired()).toBe(true);
    });

    test("is off only for the exact string false", () => {
        process.env.NEXT_PUBLIC_REVIEW_REQUIRE_EXPLANATION = "false";
        expect(isExplanationRequired()).toBe(false);

        process.env.NEXT_PUBLIC_REVIEW_REQUIRE_EXPLANATION = "0";
        expect(isExplanationRequired()).toBe(true);
    });
});

describe("closeComment", () => {
    test("stamps who closed it, when, and why", () => {
        const closed = closeComment(comment(), {
            by: "dominique_usa",
            note: "Vérifié auprès du service, adresse dédiée au retrait",
            at: "2026-07-29T10:00:00.000Z",
        });

        expect(closed).toMatchObject({
            resolved: true,
            resolved_by: "dominique_usa",
            resolved_at: "2026-07-29T10:00:00.000Z",
            resolved_note: "Vérifié auprès du service, adresse dédiée au retrait",
        });
    });

    test("keeps the original question intact", () => {
        const source = comment();
        const closed = closeComment(source, { by: "dominique_usa", note: "Réponse apportée en commentaire" });

        expect(closed.message).toBe(source.message);
        expect(closed.reviewer_name).toBe(source.reviewer_name);
        expect(closed.timestamp).toBe(source.timestamp);
    });

    test("omits an empty note rather than storing a blank one", () => {
        const closed = closeComment(comment(), { by: "dominique_usa", note: "  " });

        expect(closed).not.toHaveProperty("resolved_note");
    });

    test("reopening keeps the previous closing trace", () => {
        const closed = closeComment(comment(), { by: "dominique_usa", note: "Fermé par erreur peut-être" });
        const reopened = reopenComment(closed);

        expect(reopened.resolved).toBe(false);
        expect(reopened.resolved_note).toBe("Fermé par erreur peut-être");
        expect(reopened.resolved_by).toBe("dominique_usa");
    });
});

describe("openComments / unansweredComments", () => {
    const review = [
        comment(),
        comment({
            field: "outside_eu_storage",
            timestamp: "2026-07-28T12:58:11.775Z",
            replies: [{ message: "Pays ajoutés", author: "dominique_usa", timestamp: "2026-07-29T09:00:00.000Z" }],
        }),
        comment({ field: "nationality", timestamp: "2026-07-27T09:00:00.000Z", resolved: true }),
    ];

    test("open comments exclude resolved ones", () => {
        expect(openComments(review).map((c) => c.field)).toEqual([
            "contact_mail_delete",
            "outside_eu_storage",
        ]);
    });

    test("unanswered comments exclude the ones with a reply", () => {
        expect(unansweredComments(review).map((c) => c.field)).toEqual(["contact_mail_delete"]);
    });

    test("empty review is not blocking", () => {
        expect(unansweredComments([])).toEqual([]);
        expect(unansweredComments(undefined)).toEqual([]);
    });
});
