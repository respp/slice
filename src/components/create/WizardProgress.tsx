import React from "react";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-2 rounded-full transition-all duration-300 ${
            currentStep >= step ? "w-6 bg-[#1b1c23]" : "w-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};
