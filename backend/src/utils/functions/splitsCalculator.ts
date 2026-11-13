import { ExactSplitInput, PercentageSplitInput, SplitResult } from "../../types/expenses.types"

const toCents = (value: number): number => Math.round(value * 100);

const validateBase = (amount: number, count: number): void => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  if (count === 0) {
    throw new Error("At least one participant is required");
  }
};

const assertSumsToTotal = (splits: SplitResult[], totalCents: number): void => {
  const sum = splits.reduce((total, s) => total + toCents(s.amount), 0);
  if (sum !== totalCents) {
    throw new Error("Splits do not add up to the total amount");
  }
};

export const calculateEqualSplits = (
  amount: number,
  participantIds: string[]
): SplitResult[] => {
  validateBase(amount, participantIds.length);

  const totalCents = toCents(amount);
  const count = participantIds.length;
  const baseShare = Math.floor(totalCents / count);
  const remainder = totalCents % count;

  const splits = participantIds.map((userId, index) => {
    const cents = baseShare + (index < remainder ? 1 : 0);
    return { user: userId, amount: cents / 100 };
  });

  assertSumsToTotal(splits, totalCents);
  return splits;
};


//calculate splits in percentages for each participant
export const calculatePercentageSplits = (
  amount: number,
  percentageSplitInput: PercentageSplitInput[]
): SplitResult[] => {
  validateBase(amount, percentageSplitInput.length);

  const basisPoints = percentageSplitInput.map((input)=>{
    return Math.floor(input.percentage * 100);
  });

  const totalBasisPoints = basisPoints.reduce((total,bp) => total + bp, 0);

  if(totalBasisPoints !== 10000){
    throw new Error("Percentages must add up to 100");
  }

  const totalCents = toCents(amount);

  const shares = percentageSplitInput.map((input,index)=>{
    const bp = basisPoints[index] ?? 0;
    const numerator = totalCents * bp;
    return {
      index,
      user: input.user,
      cents: Math.floor(numerator/10000),
      remainder: numerator % 10000
    }
  });

  const assignedCents = shares.reduce((total,share) => total + share.cents, 0);

  const missingCents = totalCents - assignedCents;

  const sharesSortedByRemainder = [...shares].sort((a,b) => b.remainder - a.remainder || a.index - b.index);

  sharesSortedByRemainder.slice(0,missingCents).forEach((share)=>{
    share.cents + 1;
  });

  const result = shares.map((share)=> ({user: share.user, amount: share.cents /100}));

  assertSumsToTotal(result,totalCents);

  return result;

};



export const calculateExactSplits = (
  amount: number,
  exactSplitInput: ExactSplitInput[]
): SplitResult[] => {
  validateBase(amount, exactSplitInput.length);

  const totalCents = toCents(amount);

  const result = exactSplitInput.map((item) => {
    if (!Number.isFinite(item.amount) || item.amount < 0) {
      throw new Error("Each split amount must be zero or more");
    }
    return { user: item.user, amount: toCents(item.amount) / 100 };
  });

  const sumCents = result.reduce((total, s) => total + toCents(s.amount), 0);

  if (sumCents !== totalCents) {
    throw new Error("Split amounts must add up to the total amount");
  }

  return result;
}