/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        encoding: false,
      };
    }

    return config;
  },
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com"], // Add your image domain here
  },
};

export default nextConfig;
