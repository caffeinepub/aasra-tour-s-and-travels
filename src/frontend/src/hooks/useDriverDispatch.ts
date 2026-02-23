import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BookingRequestView, DriverBookingUpdate } from '../backend';

export function useGetDriverDispatchBookings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BookingRequestView[]>({
    queryKey: ['driverDispatch', 'bookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDriverDispatchBookings();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUpdateDriverBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: DriverBookingUpdate) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDriverBookingStatus(update);
    },
    onSuccess: (_, variables) => {
      // Invalidate dispatch list
      queryClient.invalidateQueries({ queryKey: ['driverDispatch', 'bookings'] });
      // Invalidate specific booking queries
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId.toString()] });
      // Invalidate tracking queries
      queryClient.invalidateQueries({ queryKey: ['tracking', 'booking', variables.bookingId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['tracking', 'location', variables.bookingId.toString()] });
    },
  });
}
