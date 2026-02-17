import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BookingRequest } from '../backend';

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<BookingRequest[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBooking(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<BookingRequest | null>({
    queryKey: ['booking', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getBooking(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSubmitBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: BookingRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitBooking(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
