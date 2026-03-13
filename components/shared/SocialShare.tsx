"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BlueSkyIcon,
    FacebookIcon,
    LinkedinIcon,
    MastodonIcon,
    RedditIcon,
    TelegramIcon,
    ThreadsIcon,
    TwitterIcon,
    WhatsAppIcon,
} from "../mutual-icon-svg";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SocialPlatform =
    | "LinkedIn"
    | "Bluesky"
    | "Twitter"
    | "Mastodon"
    | "Threads"
    | "Facebook"
    | "Whatsapp"
    | "Telegram"
    | "Reddit";

export type SocialShareConfig = {
    /** Base text to broadcast (without hashtags). */
    text: string;
    /** Public URL to share. */
    url: string;
    /**
     * Hashtags to append where supported (LinkedIn, Bluesky, Twitter…).
     * Include the '#' symbol or not – the component normalises them.
     * @default ["unlockmydata", "enovateurs"]
     */
    hashtags?: string[];
    /** Platforms to display – all supported ones if omitted. */
    platforms?: SocialPlatform[];
    /** Size variant for the buttons. @default "md" */
    size?: "sm" | "md" | "lg";
    /** Extra CSS classes on the wrapper div. */
    className?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_HASHTAGS = ["unlockmydata", "enovateurs"];

/** Ensure every hashtag is prefixed with '#'. */
function normaliseHashtags(raw: string[]): string[] {
    return raw.map((h) => (h.startsWith("#") ? h : `#${h}`));
}

/** Build the full share text with hashtags appended. */
function buildText(baseText: string, hashtags: string[]): string {
    if (hashtags.length === 0) return baseText;
    return `${baseText}\n${hashtags.join(" ")}`;
}

// ─── Platform metadata ────────────────────────────────────────────────────────

const SIZE_CLASS: Record<"sm" | "md" | "lg", string> = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
};

type PlatformMeta = {
    label: string;
    Icon: React.ComponentType;
    hoverColor: string;
    /** Build the share URL – text already includes hashtags */
    buildUrl: (text: string, url: string, isMobile: boolean) => string;
    /** Whether this platform supports hashtags in the text */
    supportsHashtags: boolean;
};

const PLATFORMS: Record<SocialPlatform, PlatformMeta> = {
    LinkedIn: {
        label: "LinkedIn",
        Icon: LinkedinIcon,
        hoverColor: "hover:bg-blue-100",
        buildUrl: (text, url) =>
            `https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        supportsHashtags: true,
    },
    Bluesky: {
        label: "Bluesky",
        Icon: BlueSkyIcon,
        hoverColor: "hover:bg-sky-100",
        buildUrl: (text, url) =>
            `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}`,
        supportsHashtags: true,
    },
    Twitter: {
        label: "X / Twitter",
        Icon: TwitterIcon,
        hoverColor: "hover:bg-blue-100",
        buildUrl: (text, url) =>
            `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        supportsHashtags: true,
    },
    Mastodon: {
        label: "Mastodon",
        Icon: MastodonIcon,
        hoverColor: "hover:bg-purple-100",
        buildUrl: (text, url) =>
            `https://mastodonshare.com/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        supportsHashtags: true,
    },
    Threads: {
        label: "Threads",
        Icon: ThreadsIcon,
        hoverColor: "hover:bg-gray-100",
        buildUrl: (text, url) =>
            `https://threads.net/intent/post?source=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        supportsHashtags: false,
    },
    Facebook: {
        label: "Facebook",
        Icon: FacebookIcon,
        hoverColor: "hover:bg-indigo-100",
        buildUrl: (_text, url) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        supportsHashtags: false,
    },
    Whatsapp: {
        label: "WhatsApp",
        Icon: WhatsAppIcon,
        hoverColor: "hover:bg-green-100",
        buildUrl: (text, url, isMobile) =>
            isMobile
                ? `whatsapp://send?text=${encodeURIComponent(`${text}: ${url}`)}`
                : `https://web.whatsapp.com/send?text=${encodeURIComponent(`${text}: ${url}`)}`,
        supportsHashtags: false,
    },
    Telegram: {
        label: "Telegram",
        Icon: TelegramIcon,
        hoverColor: "hover:bg-blue-200",
        buildUrl: (text, url) =>
            `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        supportsHashtags: false,
    },
    Reddit: {
        label: "Reddit",
        Icon: RedditIcon,
        hoverColor: "hover:bg-orange-100",
        buildUrl: (text, url) =>
            `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        supportsHashtags: false,
    },
};

const ALL_PLATFORMS: SocialPlatform[] = [
    "LinkedIn",
    "Bluesky",
    "Twitter",
    "Mastodon",
    "Threads",
    "Facebook",
    "Whatsapp",
    "Telegram",
    "Reddit",
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Generic social-share button row.
 *
 * @example
 * // Basic usage with default hashtags
 * <SocialShare
 *   text="J'ai libéré 3.2 Go de données 🌱"
 *   url="https://unlock-my-data.com/digital-clean-up"
 * />
 *
 * @example
 * // Custom platforms and hashtags
 * <SocialShare
 *   text="Découvrez UnlockMyData !"
 *   url="https://unlock-my-data.com"
 *   hashtags={["unlockmydata", "enovateurs", "DigitalCleanUpDay"]}
 *   platforms={["LinkedIn", "Bluesky", "Twitter"]}
 *   size="lg"
 * />
 */
export default function SocialShare({
    text,
    url,
    hashtags = DEFAULT_HASHTAGS,
    platforms = ALL_PLATFORMS,
    size = "md",
    className = "",
}: SocialShareConfig) {
    const [isMobile, setIsMobile] = useState(false);
    const normalisedHashtags = normaliseHashtags(hashtags);
    const textWithHashtags = buildText(text, normalisedHashtags);
    const textWithoutHashtags = text;

    useEffect(() => {
        const check = () =>
            setIsMobile(
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                )
            );
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const sizeClass = SIZE_CLASS[size];

    return (
        <div
            className={`flex items-center flex-wrap justify-items-center gap-3 ${className}`}
        >
            {platforms.map((platform) => {
                const meta = PLATFORMS[platform];
                if (!meta) return null;
                const shareText = meta.supportsHashtags
                    ? textWithHashtags
                    : textWithoutHashtags;
                const href = meta.buildUrl(shareText, url, isMobile);
                return (
                    <Link
                        key={platform}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={meta.label}
                        aria-label={`Partager sur ${meta.label}`}
                        className={`${sizeClass} ${meta.hoverColor} rounded-full transition-colors`}
                    >
                        <meta.Icon />
                    </Link>
                );
            })}
        </div>
    );
}
