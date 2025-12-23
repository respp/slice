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
      addLog(JSON.stringify(payload, (k, v) => (typeof v === 'bigint' ? v.toString() : v), 2));

      // 3. Send
      addLog("👉 Sending...");
      const txHash = await rawProvider.send("eth_sendTransaction", [payload]);
      
      addLog(`✅ SUCCESS! Hash: ${txHash}`);
      toast.success("Transaction Sent!");

    } catch (err: any) {
      console.error(err);
      const msg = err.info?.error?.message || err.message || JSON.stringify(err);
      addLog(`❌ FAILED: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1b1c23] text-white p-6 rounded-2xl font-mono text-xs border border-gray-800 shadow-xl mt-6">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <h3 className="font-bold uppercase">Final Validator</h3>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={sendStrictType2}
          disabled={isLoading || !address}
          className="flex-1 py-3 bg-green-600/20 border border-green-500/50 text-green-400 rounded-lg font-bold hover:bg-green-600 hover:text-white transition-all flex flex-col items-center gap-1 disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          <span>Send Valid Type-2 Tx</span>
        </button>
      </div>

      <div className="bg-black/50 p-3 rounded-lg h-64 overflow-y-auto border border-gray-800 text-gray-300">
        {logs.length === 0 && <span className="text-gray-600 italic">Ready...</span>}
        {logs.map((l, i) => (
          <div key={i} className="mb-1 break-all border-b border-gray-800/50 pb-1 whitespace-pre-wrap">{l}</div>
        ))}
      </div>
    </div>
  );
};