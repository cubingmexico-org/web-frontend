/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  cacheComponents: true,

  async redirects() {
    return [
      {
        source: "/records/:state([A-Za-z]{2,3})",
        destination: "/records?state=:state",
        permanent: true,
      },
      {
        source: "/rankings/a/:eventId/:rankType(single|average)/:state([A-Za-z]{2,3})",
        destination: "/rankings/:eventId/:rankType",
        permanent: true,
      },
      {
        source: "/rankings/a/:eventId/:rankType(single|average)",
        destination: "/rankings/:eventId/:rankType",
        permanent: true,
      },
      {
        source: "/rankings/:gender(f|m)/:eventId/:rankType(single|average)/:state([A-Za-z]{2,3})",
        destination: "/rankings/:eventId/:rankType?gender=:gender",
        permanent: true,
      },
      {
        source: "/rankings/:gender(f|m)/:eventId/:rankType(single|average)",
        destination: "/rankings/:eventId/:rankType?gender=:gender",
        permanent: true,
      },
      {
        source: "/team/:id",
        destination: "/teams/:id",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.worldcubeassociation.org",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "assets.worldcubeassociation.org",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "gf7z9ppeqt.ufs.sh",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
