type BrandLogoProps = {
    size?: number;
    dark?: boolean;
    withWordmark?: boolean;
    className?: string;
};

// "Open U-Lock" brand mark: open padlock (shackle swung up = unlock / reprenez
// le contrôle) with the gold keyhole accent (you hold the key). The gold always
// sits on the indigo lock body, never on white — see the design system README.
export default function BrandLogo({ size = 30, dark = false, withWordmark = true, className = "" }: BrandLogoProps) {
    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            <svg
                width={size + 6}
                height={size + 6}
                viewBox="0 0 64 64"
                style={{ display: "block", color: dark ? "#ffffff" : "var(--indigo-800)" }}
                aria-hidden="true"
            >
                <rect x="16" y="31" width="32" height="23" rx="7" fill="currentColor" />
                <path d="M24 34 V22.5 A9 9 0 0 1 42.5 19.5" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <circle cx="32" cy="40.5" r="3.4" fill="#dcbd45" />
                <path d="M32 42.4 L30.3 49 H33.7 Z" fill="#dcbd45" />
            </svg>
            {withWordmark && (
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: size * 0.66,
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                        color: dark ? "#ffffff" : "var(--indigo-900)",
                        whiteSpace: "nowrap",
                    }}
                >
                    Unlock <span style={{ color: dark ? "var(--indigo-300)" : "var(--indigo-500)" }}>My</span> Data
                </span>
            )}
        </span>
    );
}
