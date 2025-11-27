/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  cacheComponents: true,
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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'gf7z9ppeqt.ufs.sh',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
