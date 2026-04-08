"use client";

import { useState, useEffect, useMemo, memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface GuideViewerProps {
    slug: string;
    type: "clean" | "volume";
    lang: string;
    variant?: "plain" | "card";
}

export default memo(function GuideViewer({ slug, type, lang, variant = "plain" }: GuideViewerProps) {
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        if (!slug) return;
        
        const fetchGuide = async () => {
            let guidePath = `/data/cleanup/${slug}/${type}.${lang}.md`;

            try {
                // Try to see if there's a custom path in the service data
                const serviceRes = await fetch(`/data/manual/${slug}.json`);
                if (serviceRes.ok) {
                    const serviceData = await serviceRes.json();
                    const customPath = serviceData[`${type}_guide_${lang}`];
                    if (customPath) {
                        guidePath = customPath;
                    }
                }
            } catch (err) {
                // Ignore errors fetching service data, fallback to default path
            }

            try {
                const res = await fetch(guidePath);
                if (res.ok) {
                    const text = await res.text();
                    setContent(text.trim());
                } else {
                    setContent("");
                }
            } catch (err) {
                setContent("");
            }
        };

        fetchGuide();
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
