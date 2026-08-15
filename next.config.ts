import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.117', '192.168.1.122', '192.168.1.63'],
  ...(isDev
    ? {}
    : {
        output: 'export',
        trailingSlash: true, // important for S3, see below
        images: {
          unoptimized: true,
        },
      }),
};

export default nextConfig;
