import { NextResponse } from "next/server";

interface Policies {
    pubkey: string
    name: string
}
interface StakeWizValidator {
    rank: number
    identity: string
    vote_identity: string
    last_vote: number
    root_slot: number
    credits: number
    epoch_credits: number
    activated_stake: number
    version: string
    delinquent: boolean
    skip_rate: number
    updated_at: string
    first_epoch_with_stake: number
    name: string
    keybase: string
    description: string
    website: string
    commission: number
    image: string
    ip_latitude: string
    ip_longitude: string
    ip_city: string
    ip_country: string
    ip_asn: string
    ip_org: string
    mod: boolean
    is_jito: boolean
    jito_commission_bps: number
    admin_comment: any
    vote_success: number
    vote_success_score: number
    wiz_skip_rate: number
    skip_rate_score: number
    info_score: number
    commission_score: number
    first_epoch_distance: number
    epoch_distance_score: number
    stake_weight: number
    above_halt_line: boolean
    stake_weight_score: number
    withdraw_authority_score: number
    asn: string
    asn_concentration: number
    asn_concentration_score: number
    tpu_ip: string
    tpu_ip_concentration: number
    tpu_ip_concentration_score: number
    uptime: number
    uptime_score: number
    wiz_score: number
    version_valid: boolean
    city_concentration: number
    city_concentration_score: number
    invalid_version_score: number
    superminority_penalty: number
    score_version: number
    no_voting_override: boolean
    epoch: number
    epoch_slot_height: number
    asncity_concentration: number
    asncity_concentration_score: number
    skip_rate_ignored: boolean
    stake_ratio: number
    credit_ratio: number
    apy_estimate: number
    staking_apy: number
    jito_apy: number
    total_apy: number
}

interface validatorPolicyList {
    pubkey: string
    owner: string
    strategy: string
    network: string
    url: string
    mint: string
    name: string
    symbol: string
    description: string
    image: string
    additional_metadata: Array<any>
    identities_count: number
    validators: Array<string>
    total_validators: number
    other_identities: Array<any>
    total_other_identities: number
}

interface ValidatorResult {
    name: string | null
    voteAccount: string
    policy: string
    warning: string
}

async function fetchPolicyValidators(policy: Policies, stakeWizValidators: StakeWizValidator[]): Promise<ValidatorResult[]> {
    try {
        const response = await fetch(
            `https://www.validators.app/api/v1/policies/mainnet/${policy.pubkey}.json`,
            {
                headers: {
                    "Token": process.env.VALIDATORS_APP_API_KEY || ""
                },
            }
        );

        if (!response.ok) return [];

        const policyData: validatorPolicyList = await response.json();
        
        return policyData.validators.map((identity: string) => {
            const stakeWizValidator = stakeWizValidators.find(
                (validator: StakeWizValidator) => validator.identity === identity
            );

            return {
                name: stakeWizValidator?.name || null,
                voteAccount: stakeWizValidator?.vote_identity || '',
                policy: policy.name,
                warning: policy.name === 'Sandwicher List' ? 'MEV sandwiching detected' : 'Slow block producers'
            };
        });
    } catch (error) {
        console.error(`Error fetching policy ${policy.name}:`, error);
        return [];
    }
}

function getHighCommissionValidators(stakeWizValidators: StakeWizValidator[]): ValidatorResult[] {
    const maxCommission = 5;

    return stakeWizValidators
        .filter((validator: StakeWizValidator) => validator.commission > maxCommission)
        .map((validator: StakeWizValidator): ValidatorResult => ({
            name: validator.name || null,
            voteAccount: validator.vote_identity,
            policy: "High Commission",
            warning: `High commission rate`
        }));
}

function getGoodValidators(stakeWizValidators: StakeWizValidator[], badValidators: ValidatorResult[]): ValidatorResult[] {
    const badValidatorVoteAccounts = new Set(badValidators.map(validator => validator.voteAccount));
    const seenVoteAccounts = new Set<string>();

    return stakeWizValidators
        .filter((validator: StakeWizValidator) => {
            // Skip if it's a bad validator
            if (badValidatorVoteAccounts.has(validator.vote_identity)) {
                return false;
            }
            
            // Skip if we've already seen this vote account (deduplicate)
            if (seenVoteAccounts.has(validator.vote_identity)) {
                return false;
            }
            
            // Add to seen set and include this validator
            seenVoteAccounts.add(validator.vote_identity);
            return true;
        })
        .map((validator: StakeWizValidator): ValidatorResult => ({
            name: validator.name || null,
            voteAccount: validator.vote_identity,
            policy: "",
            warning: ""
        }));
}

function combineAndDeduplicateValidators(validatorArrays: ValidatorResult[][]): ValidatorResult[] {
    const allValidators = validatorArrays.flat();

    return allValidators.reduce((acc: ValidatorResult[], current: ValidatorResult) => {
        const existing = acc.find(validator => validator.voteAccount === current.voteAccount);

        if (!existing) {
            acc.push(current);
        } else {
            existing.policy = `${existing.policy}, ${current.policy}`;
            existing.warning = `${existing.warning}; ${current.warning}`;
        }

        return acc;
    }, []);
}

export async function GET(request: Request) {
    try {
        const policies: Policies[] = [
            {
                pubkey: "7xTAiL3tTzgbDwsxMKi2rMXW7QKzcGrABsZc2tW6L6bj",
                name: "Slow Block Producers",
            },
            {
                pubkey: "xMTozeQTEX2MR9KUon8vjg17U5Q9459RSASE3wy5eNB",
                name: "Sandwicher List",
            },
        ];

        // Fetch StakeWiz validators
        const stakeWizValidators: StakeWizValidator[] = await (await fetch(
            "https://api.stakewiz.com/validators",
        )).json();

        // Fetch all policy validators concurrently
        const policyValidatorPromises = policies.map(policy =>
            fetchPolicyValidators(policy, stakeWizValidators)
        );

        const policyValidatorArrays = await Promise.all(policyValidatorPromises);

        // Get high commission validators
        const highCommissionValidators = getHighCommissionValidators(stakeWizValidators);

        // Combine bad validators and deduplicate
        const badValidators = combineAndDeduplicateValidators([
            ...policyValidatorArrays,
            highCommissionValidators
        ]);

        // Get good validators (not in any bad list)
        const goodValidators = getGoodValidators(stakeWizValidators, badValidators);

        // Combine all validators
        const allValidators = [...badValidators, ...goodValidators];

        return NextResponse.json(allValidators);
    } catch (error) {
        console.error("[API] /api/bad-validators - Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


