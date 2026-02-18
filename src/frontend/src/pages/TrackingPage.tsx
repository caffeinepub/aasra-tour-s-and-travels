import { useParams } from '@tanstack/react-router';
import { useGetBookingForTracking, useGetDriverLocation } from '../hooks/useTracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock, User, Phone, Mail, Navigation, AlertCircle } from 'lucide-react';
import SchematicTrackingMap from '../components/tracking/SchematicTrackingMap';
import { BookingStatus } from '../backend';

export default function TrackingPage() {
  const { bookingId } = useParams({ from: '/track/$bookingId' });
  const bookingIdBigInt = BigInt(bookingId);

  const { data: booking, isLoading: bookingLoading, error: bookingError } = useGetBookingForTracking(bookingIdBigInt, true);
  const { data: driverLocation, isLoading: locationLoading } = useGetDriverLocation(bookingIdBigInt, true);

  if (bookingLoading) {
    return (
      <div className="flex flex-col">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="flex flex-col">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Booking Not Found</AlertTitle>
                <AlertDescription>
                  Unable to find booking #{bookingId}. Please check your booking reference and try again.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>
      </div>
    );
  }

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

  const pickupDate = new Date(Number(booking.pickup_time));

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-8 dark:from-amber-950/20 dark:to-orange-950/20 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Track Your Booking
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Booking Reference: <span className="font-semibold">#{bookingId}</span>
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(booking.status)} className="w-fit text-sm sm:text-base">
                {getStatusLabel(booking.status)}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Map Card */}
            {booking.status === BookingStatus.accepted && driverLocation && (
              <Card className="overflow-hidden border-2 border-amber-200 dark:border-amber-900">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <CardTitle className="text-lg sm:text-xl">Live Tracking</CardTitle>
                  </div>
                  <CardDescription>
                    {locationLoading
                      ? 'Loading driver location...'
                      : 'Your driver is on the way'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <SchematicTrackingMap location={driverLocation} />
                </CardContent>
              </Card>
            )}

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Booking Details</CardTitle>
                <CardDescription>Your trip information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Pickup</p>
                      <p className="break-words text-sm font-semibold sm:text-base">{booking.pickup_address}</p>
                      {booking.pickup_postal_code && (
                        <p className="text-xs text-muted-foreground">{booking.pickup_postal_code}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-destructive" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Destination</p>
                      <p className="break-words text-sm font-semibold sm:text-base">{booking.destination_address}</p>
                      {booking.destination_postal_code && (
                        <p className="text-xs text-muted-foreground">{booking.destination_postal_code}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pickup Time</p>
                      <p className="text-sm font-semibold sm:text-base">
                        {pickupDate.toLocaleDateString()} at {pickupDate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Passenger</p>
                      <p className="text-sm font-semibold sm:text-base">
                        {booking.first_name} {booking.last_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="break-words text-sm font-semibold sm:text-base">{booking.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="break-all text-sm font-semibold sm:text-base">{booking.email}</p>
                    </div>
                  </div>
                </div>

                {booking.comments && (
                  <div className="rounded-lg bg-muted/50 p-3 sm:p-4">
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Comments</p>
                    <p className="break-words text-sm sm:text-base">{booking.comments}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Info */}
            {booking.status === BookingStatus.pending && (
              <Alert>
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Booking Pending</AlertTitle>
                <AlertDescription>
                  Your booking is being processed. We'll assign a driver shortly and notify you.
                </AlertDescription>
              </Alert>
            )}

            {booking.status === BookingStatus.completed && (
              <Alert className="border-primary bg-primary/5">
                <AlertCircle className="h-5 w-5 text-primary" />
                <AlertTitle>Trip Completed</AlertTitle>
                <AlertDescription>
                  Thank you for choosing Aasra tour's and travels. We hope you had a pleasant journey!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
