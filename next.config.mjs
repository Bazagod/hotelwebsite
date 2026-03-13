/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon", permanent: false },
    ];
  },
};

export default nextConfig;
