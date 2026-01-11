import React from "react";
import { Users, ChevronDown } from "lucide-react";

import type { StepProps } from "../types";

export const StepBasics: React.FC<StepProps> = ({ data, updateField }) => {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-2">
        <label className="font-bold text-xs text-gray-500 uppercase tracking-wide">
          Dispute Title
        </label>
        <input
          type="text"
          className="p-4 bg-white rounded-2xl text-base font-semibold border border-gray-100 focus:ring-2 focus:ring-[#8c8fff] outline-none shadow-sm"
          placeholder="e.g. Unpaid Freelance Invoice"
          value={data.title}
          onChange={(e) => updateField("title", e.target.value)}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-xs text-gray-500 uppercase tracking-wide">
          Category
        </label>
        <div className="relative">
          <select
            className="w-full p-4 bg-white rounded-2xl text-base font-semibold border border-gray-100 focus:ring-2 focus:ring-[#8c8fff] outline-none shadow-sm appearance-none"
            value={data.category}
            onChange={(e) => updateField("category", e.target.value)}
          >
            <option value="General">General Court</option>
            <option value="Tech">Tech & Software</option>
            <option value="Freelance">Freelance & Services</option>
            <option value="E-Commerce">E-Commerce</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-xs text-gray-500 uppercase tracking-wide flex justify-between">
          <span>Jurors Needed</span>
          <span className="text-[#8c8fff]">{data.jurorsRequired}</span>
        </label>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <Users className="text-gray-400 w-5 h-5" />
          <input
            type="range"
            min="1"
            max="9"
            step="2"
            value={data.jurorsRequired}
            onChange={(e) =>
              updateField("jurorsRequired", Number(e.target.value))
            }
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1b1c23]"
          />
        </div>
        <p className="text-[10px] text-gray-400 font-medium ml-1">
          Must be an odd number (3, 5, 7...).
        </p>
      </div>
    </div>
  );
};
