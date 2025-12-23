import React, { useState } from "react";
import { parseEther } from "ethers";
import { toast } from "sonner";
import { useConnect } from "@/providers/ConnectProvider";
import { Send, Loader2, AlertTriangle } from "lucide-react";

export const NativeSendCard = () => {
  const { signer, address } = useConnect();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} > ${msg}`]);

  // Helper to safely stringify objects with BigInt (like gas or values)
  const safeStringify = (obj: any) => {
    return JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    );
  };

  const handleNativeSend = async () => {
    if (!signer || !address) {
      toast.error("No signer available");
      return;
    }

    setStatus("loading");
    setLogs([]);
    addLog("Starting Native ETH Transfer...");

    try {
      // 1. Get Network Details
      const network = await signer.provider?.getNetwork();
      addLog(`Signer Network: Chain ID ${network?.chainId}`);

      // 2. Construct Minimal Transaction
      const txPayload = {
        to: address, // Send to self
        value: parseEther("0.000001"), // Returns a BigInt
      };

      // Use safeStringify instead of JSON.stringify
      addLog(`Payload: ${safeStringify(txPayload)}`);

      // 3. Send
      addLog("Requesting Signature...");
      const tx = await signer.sendTransaction(txPayload);

      addLog(`Tx Sent! Hash: ${tx.hash}`);
      toast.success("Native Transaction Sent!");
      setStatus("success");

      addLog("Waiting for confirmation...");
      await tx.wait();
      addLog("Transaction Confirmed on-chain.");
    } catch (err: any) {
      console.error("Native Send Error", err);
      setStatus("error");

      // Extract useful error info
      const code = err.code || "UNKNOWN_CODE";
      const reason =
        err.info?.error?.message || err.shortMessage || err.message;

      addLog(`❌ ERROR (${code}):`);
      addLog(reason);
      toast.error(`Failed: ${code}`);
    } finally {
      if (status !== "error") setStatus("idle");
    }
  };

  return (
    <div className="bg-white rounded-[18px] p-5 shadow-sm border border-gray-100 flex flex-col gap-4 font-manrope">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
        {/* Updated Icon Container to match app theme (Purple/Indigo) */}
        <div className="bg-[#8c8fff]/10 p-1.5 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-[#8c8fff]" />
        </div>
        <h3 className="font-extrabold text-sm text-[#1b1c23]">Native Send</h3>
      </div>

      <p className="text-xs text-gray-500 font-medium leading-relaxed">
        Attempts to send <b className="text-[#1b1c23]">0.000001 ETH</b> to
        yourself. This tests the raw connection, bypassing Smart Contracts.
      </p>

      {/* Updated Button Style to match Primary Buttons (#1b1c23) */}
      <button
        onClick={handleNativeSend}
        disabled={status === "loading"}
        className="w-full py-3 bg-[#1b1c23] text-white rounded-xl font-bold text-xs hover:bg-[#2c2d33] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-gray-200"
      >
        {status === "loading" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Send className="w-3 h-3" />
        )}
        Test Native Send
      </button>

      {logs.length > 0 && (
        <div className="bg-[#1b1c23] rounded-xl p-3 text-[10px] font-mono text-green-400 h-32 overflow-y-auto space-y-1 border border-gray-800 shadow-inner">
          {logs.map((log, i) => (
            <div
              key={i}
              className="break-all border-b border-gray-800/50 pb-1 last:border-0 opacity-90"
            >
              <span className="opacity-50 mr-2">{">"}</span>
              {log.split(">").pop()?.trim()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
