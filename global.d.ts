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
