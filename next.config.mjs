/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/.well-known/:path*',
            destination: '/.well-known/:path*',
          },
        ];
    },
};

export default nextConfig;
