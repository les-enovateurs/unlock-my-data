declare module '*.webp' {
    import { StaticImageData } from 'next/image';
    const content: StaticImageData;
    export default content;
}

declare module '*.png' {
    import { StaticImageData } from 'next/image';
    const content: StaticImageData;
    export default content;
}

declare module '*.svg' {
    import { StaticImageData } from 'next/image';
    const content: StaticImageData;
    export default content;
}

// Donorbox donation widget (custom element registered by donorbox.org/widgets.js).
declare namespace React.JSX {
    interface IntrinsicElements {
        'dbox-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            campaign: string;
            type: string;
            interval?: string;
            'enable-auto-scroll'?: string;
        };
    }
}
