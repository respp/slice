"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryAmountHeader } from "@/components/category-amount/CategoryAmountHeader";
import { InfoCard } from "@/components/category-amount/InfoCard";
import { SwipeButton } from "@/components/category-amount/SwipeButton";
import { useCreateDispute } from "@/hooks/useCreateDispute";
import { toast } from "sonner";

export default function CreateDisputePage() {
  const router = useRouter();
  const { createDispute, isCreating } = useCreateDispute();

  // Form State
  const [defenderAddress, setDefenderAddress] = useState("");
  const [category, setCategory] = useState("General");
  const [jurorsRequired, setJurorsRequired] = useState(3);

  const handleBack = () => {
    router.push("/disputes");
  };

  const handleSwipeComplete = async () => {
    if (!defenderAddress) {
      toast.error("Please enter a defender address");
      // Reset swipe logic would go here in a real app
      return;
    }

    // Trigger the hook
    await createDispute(defenderAddress, category, jurorsRequired);

    // On success (hook handles toast), navigate back or to the new dispute
    // For now, we go back to list
    router.push("/disputes");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4">
      {/* Reusing Header for consistency */}
      <CategoryAmountHeader onBack={handleBack} />

      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center mb-4 overflow-y-auto">
        {/* Hero Animation */}
        <div className="w-20 h-20 mb-4 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden">
          {/* Reusing an existing animation for visual consistency */}
          <video
            src="/animations/category.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-[#1b1c23] font-manrope">
          Create Dispute
        </h1>

        <p className="text-gray-500 text-sm mb-6 font-manrope">
          Define the parameters to initialize a new resolution process on-chain.
        </p>

        {/* Inputs Container */}
        <div className="w-full flex flex-col gap-4 text-left">
          {/* Defender Address Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1b1c23] uppercase tracking-wider ml-1">
              Defender Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={defenderAddress}
              onChange={(e) => setDefenderAddress(e.target.value)}
              className="w-full bg-[#F5F6F9] border-none rounded-xl px-4 py-3 text-sm font-manrope text-[#1b1c23] focus:ring-2 focus:ring-[#8c8fff] outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Category Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1b1c23] uppercase tracking-wider ml-1">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F5F6F9] border-none rounded-xl px-4 py-3 text-sm font-manrope text-[#1b1c23] focus:ring-2 focus:ring-[#8c8fff] outline-none appearance-none cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Crowdfunding">Crowdfunding</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Defi">DeFi Protocol</option>
              </select>
              {/* Custom Chevron */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <img
                  src="/images/category-amount/chevron-down.svg"
                  alt="v"
                  className="w-3 h-2 opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Jurors Count Stepper */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1b1c23] uppercase tracking-wider ml-1">
              Jurors Required
            </label>
            <div className="flex items-center justify-between bg-[#F5F6F9] rounded-xl p-1">
              <button
                onClick={() =>
                  setJurorsRequired(Math.max(1, jurorsRequired - 1))
                }
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-[#1b1c23] font-bold shadow-sm active:scale-95 transition-transform"
              >
                -
              </button>
              <span className="font-manrope font-bold text-[#1b1c23] text-lg">
                {jurorsRequired}
              </span>
              <button
                onClick={() => setJurorsRequired(jurorsRequired + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-[#1b1c23] font-bold shadow-sm active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card - slightly modified message */}
      <div className="mb-24">
        {" "}
        {/* Extra margin for the swipe button */}
        <InfoCard />
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4 z-10">
        {isCreating ? (
          <div className="bg-[#1b1c23] text-white px-6 py-3 rounded-2xl font-manrope font-bold animate-pulse flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating Dispute...
          </div>
        ) : (
          <SwipeButton onSwipeComplete={() => void handleSwipeComplete()}>
            Swipe to create dispute
          </SwipeButton>
        )}
      </div>
    </div>
  );
}
