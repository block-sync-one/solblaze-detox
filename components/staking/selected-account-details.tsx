"use client";
import { Icon } from "@iconify/react";

import { StakeInfo } from "@/types/stake";

interface SelectedAccountDetailsProps {
  selectedAccount: StakeInfo;
  exchangeRate: number;
  delegateStatus: string | null;
  onDelegate: () => void;
}

export default function SelectedAccountDetails({
  selectedAccount,
  exchangeRate,
  delegateStatus,
  onDelegate,
}: SelectedAccountDetailsProps) {
  return (
    <>
      <div className="bg-secondary/50 rounded-xl p-6 border border-primary/20">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text/70 font-medium">Stake Amount</span>
            <span className="font-bold text-text text-lg">
              {selectedAccount.balance.toFixed(5)} SOL
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text/70 font-medium">Current Validator</span>
            <span className="font-medium text-right text-text/80 text-sm">
              {selectedAccount.validatorInfo?.name || "Not delegated"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text/70 font-medium">Status</span>
            <span className="font-medium text-text/80">
              {selectedAccount.validatorInfo?.warning.split(";")[0] || "Good"}
            </span>
          </div>
          <div className="border-t border-primary/20 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-text/70 font-medium">You will receive</span>
              <div className="text-right">
                <span className="font-bold text-primary text-xl">
                  {exchangeRate > 0
                    ? (selectedAccount.balance / exchangeRate).toFixed(4)
                    : "..."}{" "}
                  bSOL
                </span>
                <p className="text-xs text-text/50 mt-1 font-light">
                  ≈ Current exchange rate: {exchangeRate || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="w-full cursor-pointer bg-primary text-secondary font-bold py-4 px-6 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
        onClick={onDelegate}
      >
        {delegateStatus ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary" />
            {delegateStatus}
          </>
        ) : (
          <>
            <Icon className="w-5 h-5" icon="material-symbols:send" />
            Delegate to SolBlaze
          </>
        )}
      </button>
    </>
  );
}
