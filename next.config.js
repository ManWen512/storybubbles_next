/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "prod-files-secure.s3.us-west-2.amazonaws.com",
      "s3.eu-west-2.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
        pathname: "/**", // allows any path
      },
    ],
  },
};

module.exports = nextConfig;
