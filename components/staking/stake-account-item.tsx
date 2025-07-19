"use client";
import { Icon } from "@iconify/react";

import { StakeInfo } from "@/types/stake";
import { shortenAddress } from "@/lib/utils";

interface ExpectedImprovementsProps {
  reason?: string;
}

function ExpectedImprovements({ reason }: ExpectedImprovementsProps) {
  const getExpectedImprovements = (reason?: string) => {
    const improvements = [];

    if (!reason) {
      return [
        { icon: "material-symbols:trending-up", text: "Better APY" },
        { icon: "material-symbols:speed", text: "Faster" },
        { icon: "material-symbols:security", text: "Safer" },
      ];
    }

    const lowerReason = reason.toLowerCase();

    if (lowerReason.includes("commission") || lowerReason.includes("fee")) {
      improvements.push({
        icon: "material-symbols:trending-up",
        text: "Better APY",
      });
      improvements.push({
        icon: "material-symbols:savings",
        text: "Lower fees",
      });
    }

    if (lowerReason.includes("mev") || lowerReason.includes("sandwich")) {
      improvements.push({
        icon: "material-symbols:security",
        text: "Safer transactions",
      });
      improvements.push({
        icon: "material-symbols:verified-user",
        text: "MEV protection",
      });
    }

    if (
      lowerReason.includes("slow") ||
      lowerReason.includes("block production") ||
      lowerReason.includes("performance")
    ) {
      improvements.push({
        icon: "material-symbols:speed",
        text: "Faster transactions",
      });
      improvements.push({
        icon: "material-symbols:schedule",
        text: "Better uptime",
      });
    }

    if (
      lowerReason.includes("downtime") ||
      lowerReason.includes("offline") ||
      lowerReason.includes("unreliable")
    ) {
      improvements.push({
        icon: "material-symbols:schedule",
        text: "Better uptime",
      });
      improvements.push({
        icon: "material-symbols:verified",
        text: "More reliable",
      });
    }

    return improvements.slice(0, 3);
  };

  const improvements = getExpectedImprovements(reason);

  return (
    <div className="mt-3 pt-3 border-t border-primary/20">
      <div className="text-xs text-text/60 font-medium mb-2">
        Expected improvement:
      </div>
      <div className="flex items-center gap-4 text-sm text-primary/80">
        {improvements.map((improvement, index) => (
          <div key={index} className="flex items-center gap-1">
            <Icon className="w-4 h-4" icon={improvement.icon} />
            <span>{improvement.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StakeAccountItemProps {
  account: StakeInfo;
  isSelected: boolean;
  onSelect: (account: StakeInfo) => void;
}

export default function StakeAccountItem({
  account,
  isSelected,
  onSelect,
}: StakeAccountItemProps) {
  return (
    <button
      className={`w-full p-4 rounded-xl border cursor-pointer transition-all duration-200 text-left ${
        isSelected
          ? "border-primary/40 bg-primary/5"
          : "border-primary/20 bg-secondary/20 hover:bg-secondary/30 hover:border-primary/30"
      }`}
      onClick={() => onSelect(account)}
    >
      {/* Main Account Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-text/80">
            {shortenAddress(account.address)}
          </span>
          <span className="font-bold text-text">
            {account.balance.toFixed(5)} SOL
          </span>
        </div>

        {isSelected && (
          <Icon
            className="w-5 h-5 text-primary"
            icon="material-symbols:check-circle"
          />
        )}
      </div>

      {/* Validator Status Row */}
      <div className="flex items-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
            account.validatorInfo?.score === "good"
              ? "text-primary bg-primary/10 border border-primary/20"
              : "text-text/70 bg-text/5 border border-text/10"
          }`}
        >
          <Icon
            className="w-4 h-4"
            icon={
              account.validatorInfo?.score === "good"
                ? "material-symbols:check-circle"
                : "material-symbols:warning"
            }
          />
          <span className="font-medium">
            {account.validatorInfo?.score !== "good"
              ? account.validatorInfo?.reason
              : "Good Validator"}
          </span>
        </div>
      </div>

      {/* Expected Improvement */}
      {account.validatorInfo?.score === "bad" && isSelected && (
        <ExpectedImprovements reason={account.validatorInfo?.reason} />
      )}
    </button>
  );
}
