import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.137.1", '192.168.8.152'],
  reactCompiler: true,
};

export default nextConfig;
