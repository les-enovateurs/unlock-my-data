/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [new URL('https://fr.wikipedia.org/**'), new URL('https://upload.wikimedia.org/**')],
    },
    output: 'export',
    trailingSlash: true,
    // allowedDevOrigins: ['192.168.1.14'],
};

export default nextConfig;
