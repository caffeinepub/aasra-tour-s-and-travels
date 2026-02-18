import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BookingRequest, RateCard } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

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

export function useAssignDriver() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, driverPrincipal }: { bookingId: bigint; driverPrincipal: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignDriver(bookingId, driverPrincipal);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId.toString()] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId.toString()] });
    },
  });
}
