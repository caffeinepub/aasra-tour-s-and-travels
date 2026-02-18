import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Location } from '../backend';

export function useUpdateDriverLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, location }: { bookingId: bigint; location: Location }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDriverLocation(bookingId, location);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tracking', 'location', variables.bookingId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['tracking', 'booking', variables.bookingId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId.toString()] });
    },
  });
}
