"use client";

import React, { useState } from "react";
import { useConnect } from "@/providers/ConnectProvider";
import { toast } from "sonner";
import { Zap, CheckCircle2 } from "lucide-react";

export const SmartDebugger = () => {
  const { address, signer } = useConnect();
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (msg: string) => setLogs((prev) => [`> ${msg}`, ...prev]);

  const sendStrictType2 = async () => {
    if (!signer || !signer.provider) {
      toast.error("Wallet not ready");
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog("🚀 Starting Corrected EIP-1559 Test...");

    try {
      const rawProvider = signer.provider as any;

      // 1. Detect Chain
      const chainId = await rawProvider.send("eth_chainId", []);
      addLog(`🔗 Chain: ${chainId}`);

      // 2. Construct Payload
      // FIXED VALUES: Priority Fee < Max Fee
      const payload = {
        from: address,
        to: address,
        value: "0x0",
        data: "0x",

        type: 2, // Number type for strict schema

        gas: "0x30D40", // 200,000 Gas (Safe for Smart Accounts)

        // FIX:
        // Priority: 0.05 Gwei (Low enough)
        maxPriorityFeePerGas: "0x2FAF080",
        // Max Fee:  0.15 Gwei (Higher than priority)
        maxFeePerGas: "0x8F0D180",
      };

      addLog(`📦 Payload (Corrected Fees):`);
      addLog(
        JSON.stringify(
          payload,
          (k, v) => (typeof v === "bigint" ? v.toString() : v),
          2,
        ),
      );

      // 3. Send
      addLog("👉 Sending...");
      const txHash = await rawProvider.send("eth_sendTransaction", [payload]);

      addLog(`✅ SUCCESS! Hash: ${txHash}`);
      toast.success("Transaction Sent!");
    } catch (err: any) {
      console.error(err);
      const msg =
        err.info?.error?.message || err.message || JSON.stringify(err);
      addLog(`❌ FAILED: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[18px] p-5 shadow-sm border border-gray-100 font-manrope">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-2">
        <div className="bg-emerald-50 p-1.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <h3 className="font-extrabold text-sm text-[#1b1c23] uppercase">
          Final Validator
        </h3>
      </div>

      <div className="mb-4">
        <button
          onClick={sendStrictType2}
          disabled={isLoading || !address}
          className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Zap className="w-4 h-4 text-emerald-500" />
          <span>Send Valid Type-2 Tx</span>
        </button>
      </div>

      <div className="bg-[#1b1c23] rounded-xl p-3 text-[10px] font-mono text-green-400 h-64 overflow-y-auto border border-gray-800 shadow-inner">
        {logs.length === 0 && (
          <span className="text-gray-500 italic">Ready...</span>
        )}
        {logs.map((l, i) => (
          <div
            key={i}
            className="mb-1 break-all border-b border-gray-800/50 pb-1 whitespace-pre-wrap opacity-90"
          >
            <span className="opacity-50 mr-2">{">"}</span>
            {l.replace(/^> /, "")}
          </div>
        ))}
      </div>
    </div>
  );
};
