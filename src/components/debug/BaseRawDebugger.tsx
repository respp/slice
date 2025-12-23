"use client";

import React, { useState } from "react";
import { useConnect } from "@/providers/ConnectProvider";
import { toast } from "sonner";
import { Terminal, Play } from "lucide-react";

export const BaseRawDebugger = () => {
  const { address, signer } = useConnect();
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (msg: string) => setLogs((prev) => [`> ${msg}`, ...prev]);

  const handleSafeRawSend = async () => {
    if (!address || !signer || !signer.provider) {
      toast.error("Wallet not ready");
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog("🚀 Starting Safe Raw Transaction...");

    try {
      // FIX: Cast provider to 'any' to access the .send() method
      const rawProvider = signer.provider as any;

      // 1. Force Chain Switch via Ethers 'send' (Standard RPC method)
      try {
        const chainId = await rawProvider.send("eth_chainId", []);
        addLog(`Current Chain ID: ${chainId}`);

        if (chainId !== "0x2105") {
          // 8453 (Base Mainnet)
          addLog("⚠️ Switching to Base Mainnet (0x2105)...");
          await rawProvider.send("wallet_switchEthereumChain", [
            { chainId: "0x2105" },
          ]);
          addLog("✅ Switch request sent");
        }
      } catch (switchErr: any) {
        addLog(`⚠️ Chain Check Warning: ${switchErr.message || switchErr}`);
      }

      // 2. Construct Raw EIP-1559 Payload (Type 2)
      const rawPayload = {
        from: address,
        to: address, // Send to self
        value: "0x0",
        data: "0x",
        chainId: "0x2105", // Base Mainnet
        type: "0x2", // ❗ FORCE EIP-1559
        gas: "0x5208", // 21,000 Gas Limit

        // Hardcoded fees (approx 0.05 - 0.1 gwei)
        maxFeePerGas: "0x5F5E100", // 0.1 Gwei
        maxPriorityFeePerGas: "0x2FAF080", // 0.05 Gwei
      };

      addLog("📦 Payload constructed:");
      addLog(JSON.stringify(rawPayload, null, 2));

      // 3. Send using rawProvider.send
      addLog("👉 Sending via provider.send('eth_sendTransaction')...");

      const txHash = await rawProvider.send("eth_sendTransaction", [
        rawPayload,
      ]);

      addLog(`✅ SUCCESS! Hash: ${txHash}`);
      toast.success("Raw Transaction Sent!");
    } catch (err: any) {
      console.error(err);

      const msg =
        err.info?.error?.message ||
        err.shortMessage ||
        err.message ||
        JSON.stringify(err);

      addLog(`❌ ERROR: ${msg}`);

      if (msg.includes("User rejected") || msg.includes("rejected")) {
        addLog(
          "💡 ANALYSIS: The payload reached the wallet, but was rejected.",
        );
        addLog(
          "   1. Check if you have ETH for gas (even 0 ETH transfers cost gas).",
        );
        addLog(
          "   2. The embedded wallet might not support manual nonce/gas fields.",
        );
      } else {
        addLog("💡 ANALYSIS: The connection to the RPC provider failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0f1014] text-indigo-400 p-6 rounded-xl font-mono text-xs border border-gray-800 shadow-2xl">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
        <Terminal className="w-4 h-4 text-indigo-500" />
        <h3 className="font-bold uppercase text-white">Safe Base Debugger</h3>
      </div>

      <div className="mb-4 text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Target:</span>
          <span className="text-white">Base Mainnet (8453)</span>
        </div>
        <div className="flex justify-between">
          <span>Method:</span>
          <span className="text-blue-400">provider.send()</span>
        </div>
      </div>

      <button
        onClick={handleSafeRawSend}
        disabled={isLoading || !address}
        className="w-full py-3 bg-indigo-900/20 border border-indigo-600/50 text-indigo-400 rounded-lg font-bold hover:bg-indigo-500 hover:text-black transition-all flex justify-center gap-2 uppercase mb-4"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Play className="w-3 h-3 mt-0.5" /> Send Type-2 Tx
          </>
        )}
      </button>

      <div className="bg-black p-3 rounded-lg h-48 overflow-y-auto border border-gray-800 font-mono">
        {logs.length === 0 && (
          <span className="text-gray-700 italic">Ready to debug...</span>
        )}
        {logs.map((l, i) => (
          <div
            key={i}
            className="mb-1 break-all border-b border-gray-900/50 pb-1 whitespace-pre-wrap"
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};
