import { useCallback, useState } from "react";
import { Contract } from "ethers";
import { useSliceContract } from "./useSliceContract";
import { useXOContracts } from "@/providers/XOContractsProvider";
import { toast } from "sonner";
import { USDC_ADDRESS } from "@/config";
import { sliceAddress } from "@/contracts/slice-abi";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

export function useAssignDispute() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const contract = useSliceContract();
  const { address, signer } = useXOContracts();

  // 1. MATCHMAKER: Find a random active dispute ID (Parallelized)
  const findActiveDispute = useCallback(async (): Promise<number | null> => {
    if (!contract) return null;
    setIsFinding(true);

    try {
      // Retry logic for initial count fetch
      let countBigInt = BigInt(0);
      try {
        countBigInt = await contract.disputeCount();
      } catch (e) {
        console.warn("First attempt to fetch count failed, retrying...", e);
        await new Promise((r) => setTimeout(r, 1000));
        countBigInt = await contract.disputeCount();
      }

      const totalDisputes = Number(countBigInt);

      if (totalDisputes === 0) {
        toast.error("No disputes created yet.");
        return null;
      }

      console.log(`Scanning ${totalDisputes} disputes in parallel...`);

      // --- OPTIMIZATION: Parallel Fetching ---
      // We create an array of promises to fetch all disputes at once
      const disputeChecks = Array.from(
        { length: totalDisputes },
        (_, i) => i + 1,
      ).map(async (id) => {
        try {
          const d = await contract.disputes(id);
          // Status 1 = Commit Phase
          if (Number(d.status) === 1) {
            return id;
          }
        } catch (e) {
          console.warn(`Skipping dispute #${id}`, e);
        }
        return null;
      });

      // Wait for all requests to finish
      const results = await Promise.all(disputeChecks);

      // Filter out nulls to get valid IDs
      const availableIds = results.filter((id): id is number => id !== null);

      if (availableIds.length === 0) return null;

      // Random Selection
      const randomIndex = Math.floor(Math.random() * availableIds.length);
      return availableIds[randomIndex];
    } catch (error) {
      console.error("Error finding dispute:", error);
      return null;
    } finally {
      setIsFinding(false);
    }
  }, [contract]);

  // 2. ACTION: Join a specific dispute (With Polling & Gas Fixes)
  const joinDispute = async (disputeId: number) => {
    if (!contract || !address || !signer) {
      toast.error("Wallet not connected");
      return false;
    }

    setIsLoading(true);

    try {
      const disputeData = await contract.disputes(disputeId);
      const jurorStakeAmount = disputeData.jurorStake;

      const usdcContract = new Contract(USDC_ADDRESS, ERC20_ABI, signer);
      const amountToApprove = jurorStakeAmount;

      console.log(`Approving ${amountToApprove.toString()} units...`);
      toast.info("Step 1/2: Approving Stake...");

      // 1. Approve
      const approveTx = await usdcContract.approve(
        sliceAddress,
        amountToApprove,
      );
      await approveTx.wait();

      // --- ROBUSTNESS: Polling for Allowance ---
      toast.info("Verifying approval...");

      let approved = false;
      // Poll 10 times with 2 second intervals (Max 20s wait)
      for (let i = 0; i < 10; i++) {
        try {
          const allowance = await usdcContract.allowance(address, sliceAddress);

          if (allowance >= amountToApprove) {
            approved = true;
            break;
          }
        } catch (e) {
          console.warn("Error fetching allowance during poll:", e);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (!approved) {
        console.warn(
          "Allowance polling timed out, attempting transaction anyway...",
        );
      } else {
        toast.success("Approval confirmed!");
      }

      // --- ROBUSTNESS: Manual Gas Limit ---
      toast.info("Confirming Jury Selection...");

      const tx = await contract.joinDispute(disputeId, {
        gasLimit: 250000,
      });

      await tx.wait();

      toast.success(`Successfully joined Dispute #${disputeId}!`);
      return true;
    } catch (error: any) {
      console.error("Error joining dispute:", error);

      const msg = error.reason || error.message || "Transaction failed";

      if (msg.includes("user rejected") || msg.includes("User rejected")) {
        toast.error("Transaction cancelled");
      } else if (msg.includes("missing revert data")) {
        toast.error("Network error: Please try again in 10 seconds.");
      } else {
        toast.error(`Failed to join: ${msg.slice(0, 50)}...`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { findActiveDispute, joinDispute, isLoading, isFinding };
}
