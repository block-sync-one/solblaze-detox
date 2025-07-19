"use client"
import { Icon } from '@iconify/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-text/70 font-medium">Loading stake accounts...</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
        <Icon icon="material-symbols:error" className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-red-400 mb-2 font-medium">{error}</p>
      <button
        onClick={onRetry}
        className="text-sm text-text/70 hover:text-primary transition-colors font-light flex items-center gap-2 mx-auto"
      >
        <Icon icon="material-symbols:refresh" className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}

export function NoWalletState() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
        <Icon icon="material-symbols:account-balance-wallet" className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-text mb-4">
        Delegate to SolBlaze Pool
      </h2>
      <p className="text-text/70 mb-8 leading-relaxed font-light">
        Connect your wallet to check for any bad stake accounts
      </p>
      <WalletMultiButton className="!bg-primary hover:!bg-primary/80 !text-secondary !rounded-xl !font-semibold !px-8 !py-4 !border-0" />
    </div>
  );
}

export function NoAccountsState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
        <Icon icon="material-symbols:add-circle-outline" className="w-8 h-8 text-text/50" />
      </div>
      <p className="text-text/70 mb-2 font-medium">No stake accounts found</p>
      <p className="text-sm text-text/50 font-light">Create a stake account first to delegate to SolBlaze</p>
    </div>
  );
}

export function InitialLoadingState() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
        <Icon icon="material-symbols:account-balance-wallet" className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-text mb-4">
        Delegate to SolBlaze Pool
      </h2>
      <p className="text-text/70 mb-8 leading-relaxed font-light">
        Loading...
      </p>
    </div>
  );
} 