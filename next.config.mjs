/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
            {
              protocol: "https",
              hostname: "images.clerk.dev",
            },
            {
              protocol: "https",
              hostname: "uploadthing.com",
            },
            {
              protocol: "https",
              hostname: "placehold.co",
            },
        ]
    }
};

export default nextConfig;
