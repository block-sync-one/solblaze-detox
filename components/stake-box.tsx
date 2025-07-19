"use client"
import { useState, useEffect, useCallback, useMemo } from 'react';
import { StakeInfo, Validator } from '@/types/stake';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, StakeProgram, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { Icon } from '@iconify/react';

import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { aggregateStakeAccount, shortenAddress } from '@/lib/utils';
import { delegateStake, updateSolBlazePool } from '@/lib/staking';

import {addToast, ToastProvider} from "@heroui/toast";
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

  // Function to get expected improvements based on validator issue
  const getExpectedImprovements = useCallback((reason?: string) => {
    const improvements = [];

    if (!reason) {
      return [
        { icon: 'material-symbols:trending-up', text: 'Better APY' },
        { icon: 'material-symbols:speed', text: 'Faster' },
        { icon: 'material-symbols:security', text: 'Safer' }
      ];
    }

    const lowerReason = reason.toLowerCase();

    // Commission-related issues
    if (lowerReason.includes('commission') || lowerReason.includes('fee')) {
      improvements.push({ icon: 'material-symbols:trending-up', text: 'Better APY' });
      improvements.push({ icon: 'material-symbols:savings', text: 'Lower fees' });
    }

    // MEV/Sandwiching issues
    if (lowerReason.includes('mev') || lowerReason.includes('sandwich')) {
      improvements.push({ icon: 'material-symbols:security', text: 'Safer transactions' });
      improvements.push({ icon: 'material-symbols:verified-user', text: 'MEV protection' });
    }

    // Performance/Speed issues
    if (lowerReason.includes('slow') || lowerReason.includes('block production') || lowerReason.includes('performance')) {
      improvements.push({ icon: 'material-symbols:speed', text: 'Faster transactions' });
      improvements.push({ icon: 'material-symbols:schedule', text: 'Better uptime' });
    }

    // Reliability/Downtime issues
    if (lowerReason.includes('downtime') || lowerReason.includes('offline') || lowerReason.includes('unreliable')) {
      improvements.push({ icon: 'material-symbols:schedule', text: 'Better uptime' });
      improvements.push({ icon: 'material-symbols:verified', text: 'More reliable' });
    }



    return improvements.slice(0, 3); // Limit to 3 improvements
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
      // In a real implementation, you would:
      // 1. Create a transaction to delegate to SolBlaze validator
      // 2. Sign and send the transaction
      // 3. Update the UI accordingly
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

      //LMT: check null signatures
    
      // for (let i = 0; i < signedTx.signatures.length; i++) {

      //   if (!signedTx.signatures[i].signature) {
      //     throw Error(`missing signature for ${signedTx.signatures[i].publicKey.toString()}. Check .isSigner=true in tx accounts`)
      //   }
      // }

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
        </div>
      </NeonGradientCard>
    );
  }

  if (!publicKey) {
    return (
      <NeonGradientCard>
        <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 p-8">
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text/70 font-medium">Loading stake accounts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <Icon icon="material-symbols:error" className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 mb-2 font-medium">{error}</p>
            <button
              onClick={fetchStakeAccounts}
              className="text-sm text-text/70 hover:text-primary transition-colors font-light flex items-center gap-2 mx-auto"
            >
              <Icon icon="material-symbols:refresh" className="w-4 h-4" />
              Try again
            </button>
          </div>
        ) : stakeAccounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <Icon icon="material-symbols:add-circle-outline" className="w-8 h-8 text-text/50" />
            </div>
            <p className="text-text/70 mb-2 font-medium">No stake accounts found</p>
            <p className="text-sm text-text/50 font-light">Create a stake account first to delegate to SolBlaze</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text/90 mb-3">
                Select Stake Account to Optimize
              </label>
              <div className="max-h-70 overflow-y-auto pr-1 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb:hover]:bg-primary/30">
                {stakeAccounts.map((account) => (
             
                  <div
                    key={account.address}
                    onClick={() => handleSelectStakeAccount(account)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedAccount?.address === account.address
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-primary/20 bg-secondary/20 hover:bg-secondary/30 hover:border-primary/30'
                      }`}
                  >
                    {/* Main Account Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm text-text/80">{shortenAddress(account.address)}</span>
                        <span className="font-bold text-text">{account.balance.toFixed(5)} SOL</span>
                      </div>

                      {selectedAccount?.address === account.address && (
                        <Icon icon="material-symbols:check-circle" className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    {/* Validator Status Row */}
                    <div className="flex items-center">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${account.validatorInfo?.score === 'good'
                          ? 'text-primary bg-primary/10 border border-primary/20'
                          : 'text-text/70 bg-text/5 border border-text/10'
                        }`}>
                        <Icon
                          icon={account.validatorInfo?.score === 'good'
                            ? 'material-symbols:check-circle'
                            : 'material-symbols:warning'
                          }
                          className="w-4 h-4"
                        />
                        <span className="font-medium">
                          {account.validatorInfo?.score !== 'good'
                            ? account.validatorInfo?.reason
                            : 'Good Validator'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Expected Improvement - New Row */}
                    {account.validatorInfo?.score === 'bad' && selectedAccount?.address === account.address && (
                      <div className="mt-3 pt-3 border-t border-primary/20">
                        <div className="text-xs text-text/60 font-medium mb-2">Expected improvement:</div>
                        <div className="flex items-center gap-4 text-sm text-primary/80">
                          {getExpectedImprovements(account.validatorInfo?.reason).map((improvement, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Icon icon={improvement.icon} className="w-4 h-4" />
                              <span>{improvement.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedAccount && (
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
                        {selectedAccount.validatorInfo
                          && selectedAccount.validatorInfo?.name || 'Not delegated'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text/70 font-medium">Status</span>
                      <span className="font-medium text-text/80">{selectedAccount.validatorInfo?.warning.split(';')[0] || 'Good'}</span>
                    </div>
                    <div className="border-t border-primary/20 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-text/70 font-medium">You will receive</span>
                        <div className="text-right">
                          <span className="font-bold text-primary text-xl">
                            {exchangeRate > 0 ? (selectedAccount.balance / exchangeRate).toFixed(4) : '...'} bSOL
                          </span>
                          <p className="text-xs text-text/50 mt-1 font-light">≈ Current exchange rate: {exchangeRate || 'Loading...'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDelegate}
                 
                  className="w-full cursor-pointer bg-primary text-secondary font-bold py-4 px-6 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
                >
                  {delegateStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary"></div>
                      {delegateStatus}
                    </>
                  ) : (
                    <>
                      <Icon icon="material-symbols:send" className="w-5 h-5" />
                      Delegate to SolBlaze
                    </>
                  )}
                </button>
              </>
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
