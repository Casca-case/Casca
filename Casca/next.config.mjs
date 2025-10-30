/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.pollinations.ai', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
};

export default nextConfig;
