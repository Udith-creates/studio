
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9000-firebase-studio-1750333954490.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev',
      // It's good practice to also allow your standard local development origin if you use one
      // e.g., 'http://localhost:9002' (replace 9002 with your local port if different)
    ],
  },
};

export default nextConfig;
