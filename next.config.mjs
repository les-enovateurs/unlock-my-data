/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [new URL('https://fr.wikipedia.org/**'), new URL('https://upload.wikimedia.org/**')],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'export',
    trailingSlash: true,
};

export default nextConfig;
