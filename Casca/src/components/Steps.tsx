"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CheckIcon } from "@heroicons/react/solid";

const STEPS = [
  {
    name: "Step 1: Add image",
    description: "Choose an image for your case",
    url: "/upload",
  },
  {
    name: "Step 2: Customize design",
    description: "Make the case yours",
    url: "/design",
  },
  {
    name: "Step 3: Summary",
    description: "Review your final design",
    url: "/preview",
  },
];

const Steps = () => {
  const pathname = usePathname();

  return (
    <ol className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8 px-4 py-6">
      {STEPS.map((step, i) => {
        const isCurrent = pathname.endsWith(step.url);
        const isCompleted = STEPS.slice(i + 1).some((step) =>
          pathname.endsWith(step.url)
        );

        return (
          <li
            key={step.name}
            className="flex items-center space-x-4 lg:space-x-6"
          >
            <div className="relative flex items-center">
              {/* Circle */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ease-in-out",
                  {
                    "border-green-500 bg-green-100": isCompleted,
                    "border-primary bg-white shadow-lg": isCurrent,
                    "border-zinc-400 bg-white": !isCurrent && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="w-6 h-6 text-green-500 transition-transform transform hover:scale-110" />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-semibold transition-transform transform hover:scale-110",
                      {
                        "text-primary": isCurrent,
                        "text-zinc-700": !isCurrent,
                      }
                    )}
                  >
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Line Connector (Dots)
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 left-full -translate-y-1/2 w-16 h-1 bg-gray-300 justify-between items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                </div>
              )} */}
            </div>

            {/* Step Info */}
            <div className="flex flex-col items-start text-center lg:text-left">
              <span
                className={cn(
                  "text-base font-semibold transition-colors duration-300",
                  {
                    "text-green-500": isCompleted,
                    "text-primary": isCurrent,
                    "text-zinc-700": !isCurrent && !isCompleted,
                  }
                )}
              >
                {step.name}
              </span>
              <span className="text-sm text-zinc-500 transition-colors duration-300">
                {step.description}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Steps;
