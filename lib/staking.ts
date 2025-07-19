import { depositStake } from '@solana/spl-stake-pool';
import { PublicKey, TransactionInstruction, Connection, Signer } from '@solana/web3.js';
import { StakeInfo } from '@/types/stake';



const SOLBLAZE_POOL_KEY = "stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi";
const SOLANAHUB_VOTE_ACCOUNT = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

const createMemoInstruction = (validatorVoteAccount: string, publicKey: PublicKey): TransactionInstruction => {
  const memo = JSON.stringify({
    type: "cls/validator_stake/lamports",
    value: { validator: validatorVoteAccount }
  });

  return new TransactionInstruction({
    keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
    programId: new PublicKey(MEMO_PROGRAM_ID),
    data: Buffer.from(memo, 'utf-8')
  });
};  

export async function delegateStake(
  stakeAccount: StakeInfo,
  publicKey: PublicKey,
  connection: Connection
): Promise<[TransactionInstruction[], Signer[]] | null> {
  if (!publicKey) {
    throw new Error('Wallet not connected');
  }
  console.log('stakeAccount', stakeAccount, publicKey.toBase58())
  try {
    const validatorVoteAccount = new PublicKey(stakeAccount.validatorInfo?.voteAccount);
    const stakeAccountPK = new PublicKey(stakeAccount.address);
    const poolPublicKey = new PublicKey(SOLBLAZE_POOL_KEY);
    const instructions: TransactionInstruction[] = []
    // Create instructions
    const depositIx = await depositStake(
      connection,
      poolPublicKey,
      publicKey,
      validatorVoteAccount,
      stakeAccountPK
    );
    // @ts-ignore
    instructions.push(depositIx)
    const memoIx = createMemoInstruction(SOLANAHUB_VOTE_ACCOUNT, publicKey);
    instructions.push(memoIx)
    const signers = depositIx.signers as Signer[]
    return [instructions, signers] as [TransactionInstruction[], Signer[]];
  } catch (error) {
    console.error('Staking failed:', error);
    return null;
  }
}


export function updateSolBlazePool(signature: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await fetch(`https://stake.solblaze.org/api/v1/cls_stake?validator=${SOLANAHUB_VOTE_ACCOUNT}&txid=${signature}`)
        .catch(console.warn);
      await new Promise(resolve => setTimeout(resolve, 2000));
      let result = await (await fetch(
        "https://stake.solblaze.org/api/v1/update_pool?network=mainnet-beta"
      )).json();
      if (result.success) {
        resolve();
      } else {
        reject();
      }
    } catch (err) {
      reject();
    }
  });
}