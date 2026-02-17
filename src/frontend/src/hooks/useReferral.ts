import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ReferralBonus } from '../backend';

export function useGenerateReferralCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateReferralCode();
    },
  });
}

export function useGetReferralCode() {
  const { actor, isFetching } = useActor();
  const generateCode = useGenerateReferralCode();

  return useQuery<string>({
    queryKey: ['referralCode'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        const code = await actor.generateReferralCode();
        return code;
      } catch (error) {
        console.error('Error generating referral code:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

export function useGetReferralBonus() {
  const { actor, isFetching } = useActor();

  return useQuery<ReferralBonus | null>({
    queryKey: ['referralBonus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReferralBonus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApplyReferralCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyReferralCode(code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralBonus'] });
    },
  });
}
