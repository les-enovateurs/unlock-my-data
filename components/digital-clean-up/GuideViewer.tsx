"use client";

import { useState, useEffect } from "react";
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

export default function GuideViewer({ slug, type, lang }: GuideViewerProps) {
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

    if (!content) return null;

    return (
        <div className="prose prose-sm xl:prose-base max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
        </div>
    );
}
