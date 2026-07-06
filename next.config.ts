import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  allowedDevOrigins: ['192.168.1.117', '192.168.1.122'],
};

export default nextConfig;
