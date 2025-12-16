import {
  baseSepolia,
  base,
  scrollSepolia,
  scroll,
} from "@reown/appkit/networks";

// 1. Define the structure
type ChainContractConfig = {
  sliceContract: string;
  usdcToken: string;
};

const BASE_SLICE_CONTRACT =
  process.env.NEXT_PUBLIC_BASE_SLICE_CONTRACT ||
  "0xD8A10bD25e0E5dAD717372fA0C66d3a59a425e4D";
const SCROLL_SLICE_CONTRACT =
  process.env.NEXT_PUBLIC_SCROLL_SLICE_CONTRACT ||
  "0x095815CDcf46160E4A25127A797D33A9daF39Ec0";

// 2. Map Chain ID -> Addresses
export const CONTRACT_ADDRESSES: Record<number, ChainContractConfig> = {
  // Base Sepolia (Testnet)
  [baseSepolia.id]: {
    sliceContract: BASE_SLICE_CONTRACT,
    usdcToken: "0x5dEaC602762362FE5f135FA5904351916053cF70",
  },
  // Scroll Sepolia (Testnet)
  [scrollSepolia.id]: {
    sliceContract: SCROLL_SLICE_CONTRACT,
    usdcToken: "0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D",
  },
  // Base Mainnet
  [base.id]: {
    sliceContract: BASE_SLICE_CONTRACT,
    usdcToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  // Scroll Mainnet
  [scroll.id]: {
    sliceContract: SCROLL_SLICE_CONTRACT,
    usdcToken: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
  },
};

// Helper to get contracts safely
export const getContractsForChain = (chainId: number) => {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[baseSepolia.id]; // Fallback to default
};
