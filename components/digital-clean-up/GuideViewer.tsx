"use client";

import { useState, useEffect, useMemo, memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

const SLUGS_WITH_GUIDES = [
    "google", "gmail", "google-drive", "google-photos",
    "microsoft", "outlook", "onedrive",
    "apple", "icloud", "mail",
    "orange", "sfr", "bouygues",
    "instagram", "facebook", "twitter", "linkedin", "tiktok", "snapchat", "pinterest",
    "smartphone", "computer"
];

interface GuideViewerProps {
    slug: string;
    type: "clean" | "volume";
    lang: string;
}

export default memo(function GuideViewer({ slug, type, lang }: GuideViewerProps) {
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        if (!SLUGS_WITH_GUIDES.includes(slug)) return;

        fetch(`/data/cleanup/${slug}/${type}.${lang}.md`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.text();
            })
            .then(setContent)
            .catch(() => setContent(""));
    }, [slug, type, lang]);

    const memoizedContent = useMemo(() => content, [content]);

    if (!memoizedContent) return null;

    return (
        <div className="prose prose-sm xl:prose-base max-w-none prose-headings:text-primary prose-a:inline-block prose-a:px-4 prose-a:py-2 prose-a:rounded-lg prose-a:bg-secondary prose-a:text-white prose-a:no-underline prose-a:font-semibold prose-a:transition-all prose-a:transform hover:prose-a:bg-primary hover:prose-a:shadow-lg hover:prose-a:-translate-y-0.5">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{memoizedContent}</ReactMarkdown>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.slug === nextProps.slug && prevProps.type === nextProps.type && prevProps.lang === nextProps.lang;
});
