"use client";

import { useMemo } from "react";
import { Contract } from "ethers";
import { useXOContracts } from "@/providers/XOContractsProvider";
import { useChainId } from "wagmi";
import { getContractsForChain } from "@/config/contracts";
import { sliceAbi } from "@/contracts/slice-abi"; // Ensure this path is correct

export function useSliceContract() {
  const { signer } = useXOContracts();
  const chainId = useChainId();

  const contract = useMemo(() => {
    // 1. Get the correct address for the current chain
    const { sliceContract: sliceAddress } = getContractsForChain(chainId);

    // 2. Validation: We need the Address AND the Signer
    if (!sliceAddress || !signer) {
      return null;
    }

    try {
      // 3. Create the contract instance with the Signer (Write access)
      return new Contract(sliceAddress, sliceAbi, signer);
    } catch (error) {
      console.error("Failed to create Slice contract instance:", error);
      return null;
    }
  }, [signer, chainId]);

  return contract;
}
