import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RateCard } from '../backend';

export function useGetRateCard() {
  const { actor, isFetching } = useActor();

  return useQuery<RateCard>({
    queryKey: ['rateCard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRateCard();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useUpdateRateCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRateCard: RateCard) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRateCard(newRateCard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateCard'] });
    },
  });
}
