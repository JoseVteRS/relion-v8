import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
