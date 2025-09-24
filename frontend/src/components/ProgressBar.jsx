import React from "react";

/**
 * ProgressBar
 * props:
 *  - value: current value (number)
 *  - max: maximum value (number)
 *  - showPercent: boolean
 */
export default function ProgressBar({ value = 0, max = 100, showPercent = true }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: "var(--tw-bg-opacity, 1)" }}
        >
          {/* tailwind color applied via inline style if you want dynamic color */}
        </div>
      </div>
      {showPercent && (
        <div className="text-sm text-gray-600 flex justify-between">
          <span>₹{value}</span>
          <span>{pct}%</span>
        </div>
      )}
    </div>
  );
}
