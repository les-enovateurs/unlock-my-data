/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        domains: ['fr.wikipedia.org','upload.wikimedia.org'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    output: 'export',
    trailingSlash: true,

};

export default nextConfig;
