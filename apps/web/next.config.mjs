/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.worldcubeassociation.org',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'assets.worldcubeassociation.org',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
}

export default nextConfig
