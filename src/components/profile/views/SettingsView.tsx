"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Terminal, Bug, Shield } from "lucide-react";

export const SettingsView = () => {
  const router = useRouter();

  const openConsole = () =>
    window.dispatchEvent(new Event("open-debug-console"));

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Dev Tools Section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-manrope font-extrabold text-gray-800 uppercase tracking-wide ml-1 text-sm">
          Developer Tools
        </h3>

        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <button
            onClick={() => router.push("/debug")}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8c8fff]/10 flex items-center justify-center text-[#8c8fff] group-hover:scale-110 transition-transform">
              <Bug className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="block text-sm font-bold text-[#1b1c23]">
                Protocol Debugger
              </span>
              <span className="text-[10px] text-gray-400">
                Inspect contract state and raw data
              </span>
            </div>
          </button>

          <button
            onClick={openConsole}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="block text-sm font-bold text-[#1b1c23]">
                System Console
              </span>
              <span className="text-[10px] text-gray-400">
                View logs and events
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-manrope font-extrabold text-gray-800 uppercase tracking-wide ml-1 text-sm">
          About
        </h3>
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1b1c23]">
                Slice Protocol
              </div>
              <div className="text-[10px] font-mono text-gray-400">
                v1.0.2-beta
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Slice is a decentralized dispute resolution protocol running on
            Base. It uses VRF for juror selection and Commit-Reveal for secure
            voting.
          </p>
        </div>
      </div>

      <div className="text-center mt-4">
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          Slice - New standard for justice
        </span>
      </div>
    </div>
  );
};
