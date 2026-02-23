import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCallerProfile';
import { useGetDriverDispatchBookings, useUpdateDriverBookingStatus } from '../hooks/useDriverDispatch';
import AuthRequiredScreen from '../components/AuthRequiredScreen';
import FieldError from '../components/forms/FieldError';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Navigation,
  CheckCircle2,
  XCircle,
  Ban,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { BookingStatus, type BookingRequestView } from '../backend';

export default function DriverDispatchPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: bookings, isLoading: bookingsLoading } = useGetDriverDispatchBookings();
  const updateStatus = useUpdateDriverBookingStatus();

  const [selectedBookingId, setSelectedBookingId] = useState<bigint | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  if (!isAuthenticated) {
    return <AuthRequiredScreen />;
  }

  if (profileLoading || !profileFetched) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!userProfile || userProfile.__kind__ !== 'driver') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You must have a driver profile to access the dispatch system. Only drivers can view assigned bookings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const selectedBooking = bookings?.find((b) => b.id === selectedBookingId);

  const getStatusBadgeVariant = (status: BookingStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case BookingStatus.accepted:
        return 'default';
      case BookingStatus.completed:
        return 'secondary';
      case BookingStatus.cancelled:
      case BookingStatus.refused:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    switch (status) {
      case BookingStatus.pending:
        return 'Pending';
      case BookingStatus.accepted:
        return 'Accepted';
      case BookingStatus.completed:
        return 'Completed';
      case BookingStatus.cancelled:
        return 'Cancelled';
      case BookingStatus.refused:
        return 'Refused';
      default:
        return 'Unknown';
    }
  };

  const canAccept = (booking: BookingRequestView) => booking.status === BookingStatus.pending;
  const canRefuse = (booking: BookingRequestView) => booking.status === BookingStatus.pending;
  const canComplete = (booking: BookingRequestView) => booking.status === BookingStatus.accepted;
  const canCancel = (booking: BookingRequestView) => booking.status === BookingStatus.accepted;

  const handleAction = async (bookingId: bigint, status: BookingStatus, requiresReason: boolean) => {
    setReasonError('');

    if (requiresReason && !actionReason.trim()) {
      setReasonError('Reason is required for this action');
      return;
    }

    try {
      await updateStatus.mutateAsync({
        bookingId,
        status,
        reason: requiresReason ? actionReason.trim() : undefined,
      });
      setActionReason('');
      setReasonError('');
    } catch (err: any) {
      setReasonError(err.message || 'Failed to update booking status');
    }
  };

  const handleUpdateLocation = (bookingId: bigint) => {
    navigate({ to: `/driver/track/${bookingId.toString()}` });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/profile' })}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">Driver Dispatch</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Manage your assigned bookings
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          {bookingsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <Alert>
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>No Assigned Bookings</AlertTitle>
              <AlertDescription>
                You don't have any assigned bookings at the moment. Check back later for new assignments.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Bookings List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold sm:text-xl">Assigned Bookings</h2>
                <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
                  <div className="space-y-3">
                    {bookings.map((booking) => {
                      const pickupDate = new Date(Number(booking.pickup_time));
                      const isSelected = selectedBookingId === booking.id;

                      return (
                        <Card
                          key={booking.id.toString()}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isSelected ? 'border-2 border-amber-500 dark:border-amber-600' : ''
                          }`}
                          onClick={() => setSelectedBookingId(booking.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base sm:text-lg">
                                  Booking #{booking.id.toString()}
                                </CardTitle>
                                <CardDescription className="break-words">
                                  {booking.first_name} {booking.last_name}
                                </CardDescription>
                              </div>
                              <Badge variant={getStatusBadgeVariant(booking.status)} className="shrink-0">
                                {getStatusLabel(booking.status)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <p className="break-words text-muted-foreground">{booking.pickup_address}</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <p className="text-muted-foreground">
                                {pickupDate.toLocaleDateString()} at {pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                {selectedBooking ? (
                  <>
                    <h2 className="text-lg font-semibold sm:text-xl">Booking Details</h2>
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg sm:text-xl">
                              Booking #{selectedBooking.id.toString()}
                            </CardTitle>
                            <CardDescription>
                              {selectedBooking.first_name} {selectedBooking.last_name}
                            </CardDescription>
                          </div>
                          <Badge variant={getStatusBadgeVariant(selectedBooking.status)}>
                            {getStatusLabel(selectedBooking.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Trip Information */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-muted-foreground">Pickup</p>
                              <p className="break-words font-semibold">{selectedBooking.pickup_address}</p>
                              {selectedBooking.pickup_postal_code && (
                                <p className="text-xs text-muted-foreground">{selectedBooking.pickup_postal_code}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin className="mt-1 h-5 w-5 shrink-0 text-destructive" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-muted-foreground">Destination</p>
                              <p className="break-words font-semibold">{selectedBooking.destination_address}</p>
                              {selectedBooking.destination_postal_code && (
                                <p className="text-xs text-muted-foreground">{selectedBooking.destination_postal_code}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Pickup Time</p>
                              <p className="font-semibold">
                                {new Date(Number(selectedBooking.pickup_time)).toLocaleDateString()} at{' '}
                                {new Date(Number(selectedBooking.pickup_time)).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Contact Information */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <User className="mt-1 h-5 w-5 shrink-0 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Passenger</p>
                              <p className="font-semibold">
                                {selectedBooking.first_name} {selectedBooking.last_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-muted-foreground">Phone</p>
                              <p className="break-words font-semibold">{selectedBooking.phone_number}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="break-all font-semibold">{selectedBooking.email}</p>
                            </div>
                          </div>
                        </div>

                        {selectedBooking.comments && (
                          <>
                            <Separator />
                            <div className="rounded-lg bg-muted/50 p-3">
                              <p className="mb-1 text-sm font-medium text-muted-foreground">Comments</p>
                              <p className="break-words text-sm">{selectedBooking.comments}</p>
                            </div>
                          </>
                        )}

                        {selectedBooking.cancel_reason && (
                          <>
                            <Separator />
                            <Alert variant="destructive">
                              <AlertCircle className="h-5 w-5" />
                              <AlertTitle>Cancellation Reason</AlertTitle>
                              <AlertDescription className="break-words">{selectedBooking.cancel_reason}</AlertDescription>
                            </Alert>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Actions Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Actions</CardTitle>
                        <CardDescription>Manage this booking</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Update Location Button - Always visible for accepted bookings */}
                        {selectedBooking.status === BookingStatus.accepted && (
                          <Button
                            onClick={() => handleUpdateLocation(selectedBooking.id)}
                            className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                            size="lg"
                          >
                            <Navigation className="mr-2 h-5 w-5" />
                            Update Location
                          </Button>
                        )}

                        {/* Accept Action */}
                        {canAccept(selectedBooking) && (
                          <Button
                            onClick={() => handleAction(selectedBooking.id, BookingStatus.accepted, false)}
                            disabled={updateStatus.isPending}
                            className="w-full"
                            size="lg"
                          >
                            {updateStatus.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                Accept Booking
                              </>
                            )}
                          </Button>
                        )}

                        {/* Refuse Action */}
                        {canRefuse(selectedBooking) && (
                          <div className="space-y-2">
                            <Label htmlFor="refuseReason">Reason for Refusal *</Label>
                            <Textarea
                              id="refuseReason"
                              value={actionReason}
                              onChange={(e) => {
                                setActionReason(e.target.value);
                                setReasonError('');
                              }}
                              placeholder="Please provide a reason..."
                              disabled={updateStatus.isPending}
                              rows={3}
                            />
                            <FieldError error={reasonError} />
                            <Button
                              onClick={() => handleAction(selectedBooking.id, BookingStatus.refused, true)}
                              disabled={updateStatus.isPending}
                              variant="destructive"
                              className="w-full"
                              size="lg"
                            >
                              {updateStatus.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <XCircle className="mr-2 h-5 w-5" />
                                  Refuse Booking
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Complete Action */}
                        {canComplete(selectedBooking) && (
                          <Button
                            onClick={() => handleAction(selectedBooking.id, BookingStatus.completed, false)}
                            disabled={updateStatus.isPending}
                            variant="secondary"
                            className="w-full"
                            size="lg"
                          >
                            {updateStatus.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                Mark as Completed
                              </>
                            )}
                          </Button>
                        )}

                        {/* Cancel Action */}
                        {canCancel(selectedBooking) && (
                          <div className="space-y-2">
                            <Label htmlFor="cancelReason">Reason for Cancellation *</Label>
                            <Textarea
                              id="cancelReason"
                              value={actionReason}
                              onChange={(e) => {
                                setActionReason(e.target.value);
                                setReasonError('');
                              }}
                              placeholder="Please provide a reason..."
                              disabled={updateStatus.isPending}
                              rows={3}
                            />
                            <FieldError error={reasonError} />
                            <Button
                              onClick={() => handleAction(selectedBooking.id, BookingStatus.cancelled, true)}
                              disabled={updateStatus.isPending}
                              variant="destructive"
                              className="w-full"
                              size="lg"
                            >
                              {updateStatus.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-2 h-5 w-5" />
                                  Cancel Booking
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* No actions available */}
                        {!canAccept(selectedBooking) &&
                          !canRefuse(selectedBooking) &&
                          !canComplete(selectedBooking) &&
                          !canCancel(selectedBooking) &&
                          selectedBooking.status !== BookingStatus.accepted && (
                            <Alert>
                              <AlertCircle className="h-5 w-5" />
                              <AlertDescription>
                                No actions available for this booking in its current state.
                              </AlertDescription>
                            </Alert>
                          )}

                        {updateStatus.isSuccess && (
                          <Alert>
                            <CheckCircle2 className="h-5 w-5" />
                            <AlertDescription>Booking status updated successfully!</AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Select a Booking</AlertTitle>
                    <AlertDescription>
                      Click on a booking from the list to view details and available actions.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
