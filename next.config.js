/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['hung.stechvn.org' ,'dash93.nyc3.cdn.digitaloceanspaces.com'],
    },
    experimental: {
        serverActions: true, // <-- Add this line
    },
}

module.exports = nextConfig
