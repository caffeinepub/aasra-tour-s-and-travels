import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BookingRequest, Location } from '../backend';

export function useGetBookingForTracking(bookingId: bigint | null, enablePolling: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery<BookingRequest | null>({
    queryKey: ['tracking', 'booking', bookingId?.toString()],
    queryFn: async () => {
      if (!actor || !bookingId) return null;
      try {
        return await actor.getBooking(bookingId);
      } catch (error) {
        console.error('Error fetching booking for tracking:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && bookingId !== null,
    refetchInterval: enablePolling ? 5000 : false,
    retry: 1,
  });
}

export function useGetDriverLocation(bookingId: bigint | null, enablePolling: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery<Location | null>({
    queryKey: ['tracking', 'location', bookingId?.toString()],
    queryFn: async () => {
      if (!actor || !bookingId) return null;
      try {
        return await actor.getDriverLocation(bookingId);
      } catch (error) {
        console.error('Error fetching driver location:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && bookingId !== null,
    refetchInterval: enablePolling ? 5000 : false,
    retry: 1,
  });
}
