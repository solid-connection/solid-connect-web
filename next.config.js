/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["solid-connection.s3.ap-northeast-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
