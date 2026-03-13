import { useState } from "react";
import Link from "next/link";
import SocialShare from "./shared/SocialShare";

/**
 * Legacy wrapper kept for backward-compat with ShareButton.
 * New code should use <SocialShare> directly from components/shared.
 */
const SocialShareButtons = ({
    text,
    url,
    title = true,
    lang = "fr",
}: {
    text: string;
    url: string;
    lang: string;
    title?: boolean;
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleEmailShare = () => {
        const subject = encodeURIComponent(
            "fr" === lang
                ? "Un super article à lire des e-novateurs"
                : "Check out this link - les e-novateurs"
        );
        const body = encodeURIComponent(`${text}\n\n${url}`);
        return `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <>
            {title && (
                <p className="font-bold">
                    {lang === "fr"
                        ? "Soutenez-nous en partageant l'article :"
                        : "Support us by sharing the article:"}
                </p>
            )}
            <div className="flex items-center flex-wrap justify-items-center gap-4 mt-4">
                <SocialShare text={text} url={url} />

                {/* Copy link */}
                <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-1 hover:bg-gray-100 p-2 rounded-full"
                    aria-label={
                        copied
                            ? lang === "fr"
                                ? "Lien copié"
                                : "Copied"
                            : lang === "fr"
                            ? "Copier le lien"
                            : "Copy Link"
                    }
                >
                    {copied ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            width="22"
                            height="22"
                        >
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7l233.4-233.3c12.5-12.5 32.8-12.5 45.3 0z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            width="22"
                            height="22"
                        >
                            <path
                                d="M48 192c0-8.8 7.2-16 16-16h32v144c0 53 43 96 96 96h80v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192zM176 64c0-8.8 7.2-16 16-16h140.1l67.9 67.9V320c0 8.8-7.2 16-16 16H192c-8.8 0-16-7.2-16-16V64z"
                                style={{ opacity: ".4" }}
                            />
                            <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h140.1l67.9 67.9V320c0 8.8-7.2 16-16 16zm-192 48h192c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9l-67.8-67.9c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h192c35.3 0 64-28.7 64-64v-32h-48v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16h32v-48H64z" />
                        </svg>
                    )}
                </button>

                {/* Email */}
                <Link
                    href={handleEmailShare()}
                    className="flex items-center space-x-1 hover:bg-gray-100 p-2 rounded-full"
                    aria-label={
                        lang === "fr" ? "Partage par e-mail" : "Share via Email"
                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        width="22"
                        height="22"
                    >
                        <path
                            d="M32 128v39.9l195.6 143.4c16.9 12.4 39.9 12.4 56.8 0L480 167.9V128c0-17.7-14.3-32-32-32H64c-17.7 0-32 14.3-32 32zm0 79.6V384c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V207.6L303.3 337.1c-28.2 20.6-66.5 20.6-94.6 0L32 207.6z"
                            style={{ opacity: ".4" }}
                        />
                        <path d="M64 96c-17.7 0-32 14.3-32 32v39.9l195.6 143.4c16.9 12.4 39.9 12.4 56.8 0L480 167.9V128c0-17.7-14.3-32-32-32H64zM32 207.6V384c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32V207.6L303.3 337.1c-28.2 20.6-66.5 20.6-94.6 0L32 207.6zM0 128c0-35.3 28.7-64 64-64h384c35.3 0 64 28.7 64 64v256c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
                    </svg>
                </Link>
            </div>
        </>
    );
};

export default SocialShareButtons;