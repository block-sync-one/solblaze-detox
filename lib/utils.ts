import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { StakeInfo, Validator } from "@/types/stake";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function aggregateStakeAccount(
  account: any,
  validators: Validator[],
  currentEpoch: number,
): Partial<StakeInfo> {
  const accountInfo = account.account;
  const parsedData = accountInfo.data as any;

  //@ts-ignore
  if (!parsedData.parsed?.info) return {};

  const info = parsedData.parsed.info;
  const balance = accountInfo.lamports / LAMPORTS_PER_SOL;
  const validator = info.stake?.delegation?.voter;
  const isDelegated = !!info.stake?.delegation;
  const isActive =
    Number(info.stake?.delegation?.activationEpoch) < currentEpoch;
  const findValidator = validators.find((v) => v.voteAccount == validator);

  console.log(
    "activationEpoch",
    validator,
    info.stake?.delegation?.activationEpoch,
    currentEpoch,
    isActive,
  );

  return {
    address: account.pubkey.toBase58(),
    balance: balance,
    isActive, // if the stake account is not activated, it is inactive
    validatorInfo: findValidator
      ? {
          voteAccount: findValidator.voteAccount,
          score: findValidator.policy ? ("bad" as const) : ("good" as const),
          reason: findValidator.policy,
          name: findValidator.name || "Unknown Validator",
          warning: findValidator.warning,
        }
      : undefined,
    state: isDelegated ? findValidator?.warning : "Initialized",
  };
}
