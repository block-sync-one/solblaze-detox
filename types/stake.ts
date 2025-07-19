export type Validator = {
  name: string | null
  voteAccount: string
  policy: string
  warning: string
}
export type StakeInfo = {
  balance: number;
  address: string;  
  isActive: boolean;
  validatorInfo: {
    voteAccount: string;
    score: string;
    reason: string;
    name: string;
    warning: string;
  };
  state: string;
}