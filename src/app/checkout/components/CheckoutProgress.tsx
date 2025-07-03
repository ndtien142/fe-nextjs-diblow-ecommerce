import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface CheckoutProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-colors duration-200 ${
                step.number < currentStep
                  ? "bg-green-600 text-white"
                  : step.number === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
              onClick={() => onStepClick(step.number)}
            >
              {step.number < currentStep ? (
                <CheckIcon className="w-6 h-6" />
              ) : (
                <span className="text-sm font-semibold">{step.number}</span>
              )}
            </div>

            {/* Step Info */}
            <div className="ml-3">
              <div
                className={`text-sm font-medium ${
                  step.number <= currentStep ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.title}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  step.number < currentStep ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;
