import {
  baseSepolia,
  base,
  scrollSepolia,
  scroll,
} from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { Chain } from "viem";

const projectIdRaw = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectIdRaw) throw new Error("Project ID is not defined");
export const projectId = projectIdRaw;

// Type this as a generic Chain array (tuple with at least one element)
// instead of a strict [typeof baseSepolia, typeof base...] tuple.
export const networks: [Chain, ...Chain[]] = [
  baseSepolia,
  base,
  scrollSepolia,
  scroll,
];

// Pass to Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }) as any,
  ssr: true,
  projectId: projectId as string,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

type AppEnv = "development" | "staging" | "production";
const env = (process.env.NEXT_PUBLIC_APP_ENV || "development") as AppEnv;

const USDC_ADDRESSES = {
  development: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  staging: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  production: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base Mainnet
};

const SCROLL_USDC = {
  development: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
  staging: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
  production: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
};

export const USDC_ADDRESS = USDC_ADDRESSES[env] || USDC_ADDRESSES.development;
