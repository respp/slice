// 1. Define Types
type ChainDetail = {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: readonly string[];
  blockExplorerUrls: readonly string[];
  iconUrls: readonly string[];
};

type ChainConfig = {
  chainId: number;
  rpcUrls: { [key: number]: string };
  supportedChains: readonly ChainDetail[];
};

export type SettingsType = {
  apiDomain: string;
  environment: "development" | "staging" | "production";
  chain: ChainConfig;
};

const BASE_SEPOLIA_CONFIG = {
  chainId: 84532,
  rpcUrls: { 84532: "https://sepolia.base.org" },
  supportedChains: [
    {
      chainId: "0x14a34",
      chainName: "Base Sepolia",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://sepolia.base.org"],
      blockExplorerUrls: ["https://sepolia.basescan.org"],
      iconUrls: ["https://avatars.githubusercontent.com/u/108554348?s=200&v=4"],
    },
  ],
} as const;

const BASE_MAINNET_CONFIG = {
  chainId: 8453,
  rpcUrls: { 8453: "https://mainnet.base.org" },
  supportedChains: [
    {
      chainId: "0x2105",
      chainName: "Base",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://mainnet.base.org"],
      blockExplorerUrls: ["https://basescan.org"],
      iconUrls: ["https://avatars.githubusercontent.com/u/108554348?s=200&v=4"],
    },
  ],
} as const;

// 1. Define Scroll Configs
const SCROLL_SEPOLIA_CONFIG = {
  chainId: "0x8274f", // 534351
  chainName: "Scroll Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://sepolia-rpc.scroll.io/"],
  blockExplorerUrls: ["https://sepolia.scrollscan.com"],
  iconUrls: ["https://scroll.io/logo.png"],
} as const;

const SCROLL_MAINNET_CONFIG = {
  chainId: "0x82750", // 534352
  chainName: "Scroll",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.scroll.io/"],
  blockExplorerUrls: ["https://scrollscan.com"],
  iconUrls: ["https://scroll.io/logo.png"],
} as const;

// Note: 'chainId' at the top level is often used as a "Default"
// but 'supportedChains' allows the app to recognize others.
const development: SettingsType = {
  apiDomain: "http://localhost:5001",
  environment: "development",
  chain: {
    chainId: 84532, // Default to Base Sepolia
    rpcUrls: {
      84532: "https://sepolia.base.org",
      534351: "https://sepolia-rpc.scroll.io/", // Add Scroll RPC
    },
    // Add both chains here so the UI can handle them
    supportedChains: [
      BASE_SEPOLIA_CONFIG.supportedChains[0],
      SCROLL_SEPOLIA_CONFIG,
    ],
  },
};

const production: SettingsType = {
  apiDomain: "https://api.slicehub.com",
  environment: "production",
  chain: {
    chainId: 8453, // Default to Base Mainnet
    rpcUrls: {
      8453: "https://mainnet.base.org",
      534352: "https://rpc.scroll.io/",
    },
    supportedChains: [
      BASE_MAINNET_CONFIG.supportedChains[0],
      SCROLL_MAINNET_CONFIG,
    ],
  },
};

const staging: SettingsType = {
  apiDomain: "https://staging-api.slicehub.com",
  environment: "staging",
  chain: {
    chainId: 84532,
    rpcUrls: {
      84532: "https://sepolia.base.org",
      534351: "https://sepolia-rpc.scroll.io/",
    },
    supportedChains: [
      BASE_SEPOLIA_CONFIG.supportedChains[0],
      SCROLL_SEPOLIA_CONFIG,
    ],
  },
};

// 5. Export Config based on Environment Variable
const env = (process.env.NEXT_PUBLIC_APP_ENV ||
  process.env.NODE_ENV ||
  "development") as keyof typeof configs;

const configs = {
  development,
  staging,
  production,
};

export const settings: SettingsType = configs[env] || configs.development;
