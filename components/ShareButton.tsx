import {useEffect, useRef, useState} from "react";
import SocialShareButtons from "./SharePost";

type ShareButtonProps = {
    text?: string;         // Optional share text (defaults to document.title)
    url?: string;          // Optional URL (defaults to current location)
    lang?: string;    // UI language
    label?: string;        // Button label
    className?: string;    // Extra classes for the trigger button
};

const ShareButton = ({
                         text,
                         url,
                         lang = "fr",
                         label = "Partager",
                         className = "main-btn-marron md:w-[122px]",
                     }: ShareButtonProps) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [resolvedUrl, setResolvedUrl] = useState("https://unlock-my-data.com/" + url || "");
    const [resolvedText, setResolvedText] = useState(text || "");
    const [copied, setCopied] = useState(false);

    // Open/close the native dialog
    useEffect(() => {
        const dlg = dialogRef.current;
        if (!dlg) return;
        if (isOpen && !dlg.open) {
            dlg.showModal();
        } else if (!isOpen && dlg.open) {
            dlg.close();
        }
    }, [isOpen]);

    // Close on outside click
    const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) setIsOpen(false);
    };

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(resolvedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // No-op
        }
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                aria-haspopup="dialog"
                aria-controls="share-post"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 p-6 rounded-xl transition-colors border border-white/20 cursor-pointer">
                <div className="text-3xl mb-3">📢</div>
                <div className="font-bold mb-1">Partagez</div>
                <div className="text-sm text-blue-100">Faites connaître le projet</div>
            </div>

            <dialog
                id="share-post"
                ref={dialogRef}
                role="dialog"
                aria-label={lang === "fr" ? "Partager cet article" : "Share this article"}
                className="rounded-lg p-0 w-[min(92vw,680px)] m-auto"
                onClick={onDialogClick}
            >
                <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-marron-900 font-bold text-[32px] leading-[140%]">
                            {lang === "fr" ? "Partager cet outil" : "Share this tool"}
                        </h2>
                        <form method="dialog">
                            <button
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                                formNoValidate
                                onClick={() => setIsOpen(false)}
                            >
                                {lang === "fr" ? "Fermer" : "Close"}
                            </button>
                        </form>
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="url-input-share-post"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {lang === "fr" ? "URL :" : "URL:"}
                        </label>
                        <div className="flex items-stretch gap-2">
                            <input
                                id="url-input-share-post"
                                className="flex-1 rounded-md border px-3 py-2 text-sm overflow-hidden text-ellipsis"
                                type="text"
                                readOnly
                                value={resolvedUrl}
                                onFocus={(e) => e.currentTarget.select()}
                            />
                            <button
                                type="button"
                                onClick={onCopy}
                                className="rounded-md bg-amber-700 text-white px-3 py-2 text-sm hover:bg-amber-800"
                                title={
                                    lang === "fr"
                                        ? "Copier l’URL dans le presse-papiers"
                                        : "Copy URL to clipboard"
                                }
                            >
                                {copied ? (lang === "fr" ? "Copié" : "Copied") : (lang === "fr" ? "Copier" : "Copy")}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-marron-900 font-bold text-[24px] leading-[140%] mb-2">
                            {lang === "fr" ? "Sur les réseaux sociaux" : "On social networks"}
                        </h3>

                        {/* Reuse your existing social share buttons */}
                        <SocialShareButtons text={resolvedText} url={resolvedUrl} lang={lang} title={false} />
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default ShareButton;
