"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DisputeCard } from "./DisputeCard";
import { BarChartIcon } from "./icons/Icon";
import { FilterIcon } from "./icons/BadgeIcons";
import { useConnect } from "@/providers/ConnectProvider";
import { useSliceContract } from "@/hooks/useSliceContract";
import { fetchJSONFromIPFS } from "@/util/ipfs";
import { Gavel, History, Loader2 } from "lucide-react"; // Added Icons

export interface Dispute {
  id: string;
  title: string;
  icon?: string;
  category: string;
  votesCount: number;
  totalVotes: number;
  prize: string;
  status: number;
  revealDeadline: number;
  voters: any[];
}

export const DisputesList: React.FC = () => {
  const router = useRouter();
  const { address } = useConnect();
  const contract = useSliceContract();

  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDisputes = async () => {
      if (!contract || !address) return;
      setIsLoading(true);
      try {
        const jurorIds = await contract.getJurorDisputes(address);

        const loaded = await Promise.all(
          jurorIds.map(async (idBg: bigint) => {
            const id = idBg.toString();
            const d = await contract.disputes(id);
            let title = `Dispute #${id}`;
            if (d.ipfsHash) {
              const meta = await fetchJSONFromIPFS(d.ipfsHash);
              if (meta?.title) title = meta.title;
            }

            return {
              id,
              title,
              category: d.category,
              votesCount: 0, // In production, you would fetch revealedVotes count here
              totalVotes: Number(d.jurorsRequired),
              prize: "Rewards Pending",
              status: Number(d.status),
              revealDeadline: Number(d.revealDeadline),
              voters: [],
            };
          }),
        );

        setDisputes(loaded.reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadDisputes();
  }, [contract, address]);

  // Filter based on Tabs
  const displayedDisputes = disputes.filter((d) => {
    // Status 3 = Executed/Finished. Everything else is "Active"
    if (activeTab === "active") return d.status < 3;
    return d.status === 3;
  });

  return (
    <div className="px-5 mt-8 w-full box-border pb-32">
      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-100 mb-6">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 text-sm font-bold transition-all ${
            activeTab === "active"
              ? "text-gray-800 border-b-2 border-gray-800"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Active Cases
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-bold transition-all ${
            activeTab === "history"
              ? "text-[#1b1c23] border-b-2 border-[#1b1c23]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Past History
        </button>
      </div>

      <div className="flex justify-between items-center mb-5 w-full">
        <div className="flex items-center gap-[11px]">
          <div className="w-5 h-5 flex items-center justify-center shrink-0 overflow-hidden rounded-[6px]">
            <BarChartIcon />
          </div>
          <h2 className="font-manrope font-extrabold text-[15px] text-[#1b1c23]">
            {activeTab === "active" ? "Current Portfolio" : "Resolved Cases"}
          </h2>
        </div>
        <button className="bg-white rounded-[13.5px] px-[14px] py-[6px] flex items-center gap-2 font-extrabold text-[11px] text-[#1b1c23] hover:opacity-80">
          <span>Filter</span>
          <FilterIcon size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-[25px] mb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#8c8fff] animate-spin" />
            <span className="text-xs text-gray-400 mt-2 font-bold">
              Loading cases...
            </span>
          </div>
        ) : displayedDisputes.length === 0 ? (
          /* --- MODERN EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-200">
              {activeTab === "active" ? (
                <Gavel className="w-9 h-9 text-gray-300" />
              ) : (
                <History className="w-9 h-9 text-gray-300" />
              )}
            </div>

            <h3 className="text-gray-800 font-manrope font-extrabold text-base mb-1">
              {activeTab === "active" ? "No Active Cases" : "No History Yet"}
            </h3>

            <p className="text-gray-400 text-xs font-medium max-w-[220px] leading-relaxed mx-auto">
              {activeTab === "active"
                ? "Check 'Inbox' for tasks or find new ones."
                : "Past resolved cases will appear here."}
            </p>
          </div>
        ) : (
          displayedDisputes.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} />
          ))
        )}
      </div>

      <button
        onClick={() => router.push("/category-amount")}
        className="fixed bottom-[90px] left-1/2 -translate-x-1/2 z-40 w-48 h-10 bg-white text-[#1b1c23] border-2 border-[#8c8fff] rounded-[14px] shadow-lg font-bold hover:bg-[#8c8fff] hover:text-white flex items-center justify-center transition-all"
      >
        Judge &amp; Earn
      </button>
    </div>
  );
};
