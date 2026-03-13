"use client";

import { useState, useEffect, useMemo, memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

const SLUGS_WITH_GUIDES = [
    "google", "gmail", "google-drive", "google-photos",
    "microsoft", "outlook", "onedrive",
    "meta",
    "apple", "icloud", "mail",
    "orange", "sfr", "bouygues",
    "instagram", "facebook", "twitter", "linkedin", "tiktok", "snapchat", "pinterest",
    "smartphone", "computer"
];

interface GuideViewerProps {
    slug: string;
    type: "clean" | "volume";
    lang: string;
    variant?: "plain" | "card";
}

export default memo(function GuideViewer({ slug, type, lang, variant = "plain" }: GuideViewerProps) {
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        if (!SLUGS_WITH_GUIDES.includes(slug)) return;

        fetch(`/data/cleanup/${slug}/${type}.${lang}.md`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.text();
            })
            .then(text => setContent(text.trim()))
            .catch(() => setContent(""));
    }, [slug, type, lang]);

    const memoizedContent = useMemo(() => content, [content]);

    if (!memoizedContent) return null;

    const guideBody = (
        <div className="prose prose-sm xl:prose-base max-w-none prose-headings:text-primary">
            <ReactMarkdown
                rehypePlugins={[rehypeSanitize]}
                components={{
                    a: ({ href, children, ...props }) => {
                        const isExternal = Boolean(href && /^(https?:)?\/\//.test(href));

                        return (
                            <a
                                {...props}
                                href={href}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="inline-block my-1 font-semibold text-secondary underline underline-offset-4 decoration-secondary/40 transition-colors hover:text-primary hover:decoration-primary"
                            >
                                {children}
                            </a>
                        );
                    },
                }}
            >
                {memoizedContent}
            </ReactMarkdown>
        </div>
    );

    if (variant === "card") {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-base-200">
                {guideBody}
            </div>
        );
    }

    return guideBody;
}, (prevProps, nextProps) => {
    return prevProps.slug === nextProps.slug && prevProps.type === nextProps.type && prevProps.lang === nextProps.lang && prevProps.variant === nextProps.variant;
});
