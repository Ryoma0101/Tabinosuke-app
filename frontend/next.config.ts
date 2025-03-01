import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScriptエラーをビルド時に無視
  },
  output: 'standalone', // スタンドアロンモードでビルド
};

export default nextConfig;
