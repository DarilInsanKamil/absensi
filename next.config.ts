import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  basePath: '/absensiteknomedia',
  env: {
    LOCAL_TEST_API: process.env.LOCAL_TEST_API,
  },
};



export default nextConfig;
