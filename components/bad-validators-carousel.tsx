"use client";
import { useState, useEffect } from "react";

import { shortenAddress } from "@/lib/utils";
import { Validator } from "@/types/stake";

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Function to filter validators to max 30 per policy
function filterValidatorsByPolicy(
  validators: Validator[],
  maxPerPolicy: number = 30,
): Validator[] {
  const policyGroups: { [policy: string]: Validator[] } = {};

  // Group validators by policy
  validators.forEach((validator) => {
    if (!policyGroups[validator.policy]) {
      policyGroups[validator.policy] = [];
    }
    policyGroups[validator.policy].push(validator);
  });

  // Limit each policy group to maxPerPolicy and combine
  const filteredValidators: Validator[] = [];

  Object.values(policyGroups).forEach((group) => {
    // Shuffle each policy group first to ensure random selection when limiting
    const shuffledGroup = shuffleArray(group);

    filteredValidators.push(...shuffledGroup.slice(0, maxPerPolicy));
  });

  return filteredValidators;
}

export default function BadValidatorsCarousel({
  badValidators,
}: {
  badValidators: Validator[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledValidators, setShuffledValidators] = useState<Validator[]>([]);

  useEffect(() => {
    // Filter to max 30 per policy, then shuffle

    const filteredValidators = filterValidatorsByPolicy(
      badValidators.filter(
        (validator) => validator.policy && validator.policy.trim(),
      ),
      30,
    );

    console.log(
      "filteredValidators",
      badValidators.filter(
        (validator) => validator.policy && validator.policy.trim(),
      ),
      30,
    );
    setShuffledValidators(shuffleArray(filteredValidators));
    setCurrentIndex(0);
  }, [badValidators]);

  useEffect(() => {
    if (shuffledValidators.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % shuffledValidators.length;

        // Re-shuffle when we complete a full cycle to keep it interesting
        if (nextIndex === 0) {
          const filteredValidators = filterValidatorsByPolicy(
            badValidators.filter(
              (validator) => validator.policy && validator.policy.trim(),
            ),
            30,
          );

          setShuffledValidators(shuffleArray(filteredValidators));
        }

        return nextIndex;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [shuffledValidators, badValidators]);

  const currentValidator = shuffledValidators[currentIndex];

  if (!currentValidator) return null;

  return (
    <div className="relative">
      <div className="flex items-center space-x-3 text-text/70">
        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
        <div className="flex items-center space-x-2 font-mono">
          <span className="font-semibold text-red-400 transition-all duration-300">
            {currentValidator.name ||
              shortenAddress(currentValidator.voteAccount)}
          </span>
          <span className="text-text/60">{currentValidator.policy}</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex space-x-1 mt-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex % 7
                ? "w-6 bg-red-400"
                : "w-2 bg-red-400/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
