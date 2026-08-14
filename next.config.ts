import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   output: 'export',
//   images: {
//     unoptimized: true,
//   },
//   allowedDevOrigins: ['192.168.1.117', '192.168.1.122'],
// };

// export default nextConfig;

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.117', '192.168.1.122'],
  ...(isDev
    ? {}
    : {
        output: 'export',
        images: {
          unoptimized: true,
        },
      }),
};

export default nextConfig;
