import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dhqzplbhi/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dhqzplbhi/image/upload/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dhqzplbhi/raw/upload/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dhqzplbhi/raw/upload/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverActions: {
    bodySizeLimit: "5mb",
  },
};

export default nextConfig;