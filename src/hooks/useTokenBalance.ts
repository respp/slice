"use client";

import { useState, useEffect } from "react";
import { useBalance } from "wagmi";
import { Contract, formatUnits } from "ethers";
import { useEmbedded } from "@/providers/EmbeddedProvider";
import { useXOContracts } from "@/providers/XOContractsProvider";
import { erc20Abi } from "@/contracts/erc20-abi";

export function useTokenBalance(tokenAddress: string) {
  const { isEmbedded } = useEmbedded();
  const { address, signer } = useXOContracts();

  // --- 1. Standard Mode (Wagmi) ---
  const {
    data: wagmiData,
    isLoading: isWagmiLoading,
    refetch,
  } = useBalance({
    address: address as `0x${string}`,
    token: isEmbedded ? undefined : (tokenAddress as `0x${string}`), // Disable wagmi in embedded mode
    query: {
      enabled: !isEmbedded && !!address, // Only run if NOT embedded
    },
  });

  // --- 2. Embedded Mode (Ethers.js) ---
  const [embeddedBalance, setEmbeddedBalance] = useState<string | null>(null);
  const [isEmbeddedLoading, setIsEmbeddedLoading] = useState(false);

  useEffect(() => {
    if (!isEmbedded || !address || !signer || !tokenAddress) return;

    const fetchEmbeddedBalance = async () => {
      setIsEmbeddedLoading(true);
      try {
        const contract = new Contract(tokenAddress, erc20Abi, signer);
        // USDC uses 6 decimals; fetch decimals dynamically if needed,
        // but hardcoding 6 for USDC is safe for this specific fix.
        // Better yet: await contract.decimals() if you want to be generic.
        const decimals = await contract.decimals();
        const balance = await contract.balanceOf(address);

        setEmbeddedBalance(formatUnits(balance, decimals));
      } catch (error) {
        console.error("Failed to fetch embedded balance:", error);
        setEmbeddedBalance(null);
      } finally {
        setIsEmbeddedLoading(false);
      }
    };

    fetchEmbeddedBalance();
  }, [isEmbedded, address, signer, tokenAddress]);

  // --- 3. Unified Return ---
  if (isEmbedded) {
    return {
      formatted: embeddedBalance,
      symbol: "USDC", // You can fetch this too if needed
      isLoading: isEmbeddedLoading,
      refetch: () => {
        /* re-trigger effect dependency if needed */
      },
    };
  }

  return {
    formatted: wagmiData?.formatted,
    symbol: wagmiData?.symbol,
    isLoading: isWagmiLoading,
    refetch,
  };
}
