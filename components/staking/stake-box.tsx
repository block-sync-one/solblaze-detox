"use client"
import { useState, useEffect, useCallback, useMemo } from 'react';
import { StakeInfo, Validator } from '@/types/stake';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, StakeProgram, Transaction } from '@solana/web3.js';
import { Icon } from '@iconify/react';

import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import StakeAccountItem from './stake-account-item';
import SelectedAccountDetails from './selected-account-details';
import { 
  LoadingState, 
  ErrorState, 
  NoWalletState, 
  NoAccountsState, 
  InitialLoadingState 
} from './stake-box-states';
import { aggregateStakeAccount } from '@/lib/utils';
import { delegateStake, updateSolBlazePool } from '@/lib/staking';

import { addToast } from "@heroui/toast";
import { Button } from '@heroui/button';

export default function StakeBox({ validators }: { validators: Validator[] }) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [stakeAccounts, setStakeAccounts] = useState<StakeInfo[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<StakeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delegateStatus, setDelegateStatus] = useState<string | null>(null);
  
  // Memoize validators to prevent unnecessary recreations
  const memoizedValidators = useMemo(() => validators, [validators.length, validators.map(v => v.voteAccount).join(',')]);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectStakeAccount = useCallback((account: StakeInfo) => {
    console.log('account', account)
    setSelectedAccount(account);
  }, []);

  const stakePoolExchangeRate = useCallback(async () => {
    const allPools = await fetch('https://api.solanahub.app/api/stake/get-stake-pools')
    const data = await allPools.json()
    const solblazePool = data.find((pool: any) => pool.poolName === 'solblaze')
    return solblazePool.exchangeRate
  }, [])

  useEffect(() => {
    if (mounted) {
      stakePoolExchangeRate().then(setExchangeRate)
    }
  }, [mounted, stakePoolExchangeRate])

  const fetchStakeAccounts = useCallback(async () => {
    if (!publicKey || !connection) return;

    setLoading(true);
    setError(null);
    try {
      // Fetch all stake accounts owned by the wallet
      const currentEpoch = await connection.getEpochInfo();
      const accounts = await connection.getParsedProgramAccounts(StakeProgram.programId, {
        commitment: 'confirmed',
        filters: [
          {
            memcmp: {
              offset: 12, // Offset for authorized staker
              bytes: publicKey.toBase58(),
            },
          },
        ],
      });
      
      // filter out stake account that are not in active state
      console.log('accounts', accounts)
      const stakeAccountsData: Partial<StakeInfo>[] = accounts
        .map(account => aggregateStakeAccount(account, memoizedValidators, currentEpoch.epoch))
        .filter(account => account.isActive)
        .sort((a, b) => {
          // Sort bad validators to the top
          if (a.validatorInfo?.score === 'bad' && b.validatorInfo?.score !== 'bad') return -1;
          if (a.validatorInfo?.score !== 'bad' && b.validatorInfo?.score === 'bad') return 1;
          // If both are bad or both are good, sort by balance (highest first)
          return (b.balance || 0) - (a.balance || 0);
        });
      console.log(stakeAccountsData)
      setStakeAccounts(stakeAccountsData as StakeInfo[]);

      // Only set default selected account if none is currently selected
      setSelectedAccount(prevSelected => {
        if (!prevSelected && stakeAccountsData.length > 0) {
          return stakeAccountsData[0] as StakeInfo;
        }
        return prevSelected;
      });
    } catch (error) {
      console.error('Error fetching stake accounts:', error);
      setError("Couldn't fetch stake accounts");
      setStakeAccounts([]);
      setSelectedAccount(null);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection, memoizedValidators]);

  useEffect(() => {
    if (publicKey && mounted) {
      fetchStakeAccounts();
    } else {
      setStakeAccounts([]);
      setSelectedAccount(null);
    }
  }, [publicKey, fetchStakeAccounts, mounted]);

  const handleDelegate = useCallback(async () => {
    if (!selectedAccount || !publicKey) {
      return;
    }
    setDelegateStatus('Delegating...');
    try {
      // @ts-ignore
      const [instructions, signers] = await delegateStake(selectedAccount, publicKey, connection);
      // Build and send transaction
      const { lastValidBlockHeight, blockhash } = await connection.getLatestBlockhash();
      const transaction = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight });

      transaction.add(...instructions);
      if (!signTransaction) return null;
      const signedTx = await signTransaction(transaction);
      if (!signedTx) {
        throw Error('Failed to sign transaction')
      }
      if (signers?.length > 0) transaction.partialSign(...signers)

      const rawTransaction = signedTx.serialize({ requireAllSignatures: false });
      const txId = await connection.sendRawTransaction(rawTransaction);
      console.log('confirmed txId', txId)
      updateSolBlazePool(txId);
      setDelegateStatus('Delegated');
      addToast({
        title: "Delegated successfully",
        color: "success",
        endContent: (
          <Button size="sm" color="default" variant="flat" onPress={() => {
            window.open(`https://solscan.io/tx/${txId}`, '_blank');
          }}>
            View Transaction
          </Button>
        ),
      })
      
      // Simulate delegation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refresh stake accounts after delegation
      await fetchStakeAccounts();
    } catch (error) {
      console.error('Error delegating stake:', error);
      setDelegateStatus('Error');
    } finally {
      setDelegateStatus(null);
    }
  }, [selectedAccount, publicKey, signTransaction, connection, fetchStakeAccounts]);

  // Prevent hydration mismatch by not rendering wallet-dependent content until mounted
  if (!mounted) {
    return (
      <NeonGradientCard>
        <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 p-8">
          <InitialLoadingState />
        </div>
      </NeonGradientCard>
    );
  }

  if (!publicKey) {
    return (
      <NeonGradientCard>
        <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 p-8">
          <NoWalletState />
        </div>
      </NeonGradientCard>
    );
  }

  return (
    <NeonGradientCard>
      <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">
              Delegate to SolBlaze Pool
            </h2>
            <p className="text-text/70 font-light">Receive bSOL tokens for your delegation</p>
          </div>
          <WalletMultiButton className="!bg-secondary/50 hover:!bg-secondary/70 !text-text/80 !rounded-xl !text-sm !px-4 !py-2 !font-medium !border !border-primary/20" />
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchStakeAccounts} />
        ) : stakeAccounts.length === 0 ? (
          <NoAccountsState />
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text/90 mb-3">
                Select Stake Account to Optimize
              </label>
              <div className="max-h-70 overflow-y-auto pr-1 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb:hover]:bg-primary/30">
                {stakeAccounts.map((account) => (
                  <StakeAccountItem
                    key={account.address}
                    account={account}
                    isSelected={selectedAccount?.address === account.address}
                    onSelect={handleSelectStakeAccount}
                  />
                ))}
              </div>
            </div>

            {selectedAccount && (
              <SelectedAccountDetails
                selectedAccount={selectedAccount}
                exchangeRate={exchangeRate}
                delegateStatus={delegateStatus}
                onDelegate={handleDelegate}
              />
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text/50">
          <div className="flex items-center gap-2">
            <Icon icon="material-symbols:security" className="w-4 h-4" />
          </div>
          <span className="font-light max-w-sm text-center">Your stake will be partially delegated to solanahub validator as a gesture for building this public good app</span>
        </div>
      </div>
    </NeonGradientCard>
  );
}
