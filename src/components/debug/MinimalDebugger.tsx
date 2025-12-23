"use client";

import React, { useState } from "react";
import { useConnect } from "@/providers/ConnectProvider";
import { toast } from "sonner";
import { Terminal, Send, Zap } from "lucide-react";

export const MinimalDebugger = () => {
  const { address, signer } = useConnect();
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (msg: string) => setLogs((prev) => [`> ${msg}`, ...prev]);

  // TEST 1: The "Hands Off" Approach
  // We send NO gas, NO type, NO fees. We let the embedded wallet decide.
  const sendAuto = async () => {
    await runTest("AUTO_ESTIMATE", {
      to: address, // Send to self
      value: "0x0",
    });
  };

  // TEST 2: The "Smart Wallet Safe" Approach
  // We force 150,000 gas (0x249F0). This is enough for complex Smart Accounts.
  // 21,000 (0x5208) fails for smart wallets.
  const sendHighGas = async () => {
    await runTest("HIGH_GAS_LIMIT", {
      to: address,
      value: "0x0",
      gas: "0x249F0", // 150,000 Gas
    });
  };

  const runTest = async (testName: string, payload: any) => {
    if (!signer || !signer.provider) {
      toast.error("Wallet not ready");
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog(`🚀 Starting Test: ${testName}`);

    try {
      // Cast to 'any' to access low-level send
      const rawProvider = signer.provider as any;

      // 1. Force Chain Switch (Just in case)
      try {
        const chainId = await rawProvider.send("eth_chainId", []);
        if (chainId !== "0x2105") {
          // Base Mainnet
          addLog("⚠️ Wrong Chain. Switching...");
          await rawProvider.send("wallet_switchEthereumChain", [
            { chainId: "0x2105" },
          ]);
        }
      } catch (_e) {}

      // 2. Add 'from' address (standard requirement)
      const fullPayload = {
        from: address,
        ...payload,
      };

      addLog(`📦 Payload: ${JSON.stringify(fullPayload)}`);

      // 3. Send
      const txHash = await rawProvider.send("eth_sendTransaction", [
        fullPayload,
      ]);

      addLog(`✅ SUCCESS! Hash: ${txHash}`);
      toast.success(`${testName} Passed!`);
    } catch (err: any) {
      console.error(err);
      const msg =
        err.info?.error?.message || err.message || JSON.stringify(err);
      addLog(`❌ FAILED: ${msg}`);

      if (testName === "AUTO_ESTIMATE" && msg.includes("rejected")) {
        addLog(
          "💡 TIP: Try the 'High Gas' button. Smart wallets often fail auto-estimation.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1b1c23] text-white p-6 rounded-2xl font-mono text-xs border border-gray-800 shadow-xl mt-6">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
        <Terminal className="w-4 h-4 text-purple-400" />
        <h3 className="font-bold uppercase">Minimal Debugger</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={sendAuto}
          disabled={isLoading}
          className="py-3 bg-blue-600/20 border border-blue-500/50 text-blue-400 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all flex flex-col items-center gap-1"
        >
          <Send className="w-4 h-4" />
          <span>Auto-Estimate</span>
        </button>

        <button
          onClick={sendHighGas}
          disabled={isLoading}
          className="py-3 bg-purple-600/20 border border-purple-500/50 text-purple-400 rounded-lg font-bold hover:bg-purple-600 hover:text-white transition-all flex flex-col items-center gap-1"
        >
          <Zap className="w-4 h-4" />
          <span>High Gas (150k)</span>
        </button>
      </div>

      <div className="bg-black/50 p-3 rounded-lg h-32 overflow-y-auto border border-gray-800 text-gray-300">
        {logs.length === 0 && (
          <span className="text-gray-600 italic">Waiting for input...</span>
        )}
        {logs.map((l, i) => (
          <div
            key={i}
            className="mb-1 break-all border-b border-gray-800/50 pb-1"
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};
