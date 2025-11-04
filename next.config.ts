import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  redirects: async () => {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/lists",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
