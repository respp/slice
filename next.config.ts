import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "@solana/web3.js": false,
      "@solana-program/system": false,
      "@solana-program/token": false,
      "@solana-program/memo": false,
      "@solana/kit": false,
      bs58: false,
    };

    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default withPWA(nextConfig);
