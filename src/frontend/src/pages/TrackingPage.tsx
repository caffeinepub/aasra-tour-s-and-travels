import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetBookingForTracking, useGetDriverLocation } from '../hooks/useTracking';
import AuthRequiredScreen from '../components/AuthRequiredScreen';
import SchematicTrackingMap from '../components/tracking/SchematicTrackingMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, Phone, Navigation, ArrowLeft } from 'lucide-react';
import { BookingStatus } from '../backend';

export default function TrackingPage() {
  const { bookingId } = useParams({ strict: false }) as { bookingId?: string };
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const bookingIdBigInt = bookingId ? BigInt(bookingId) : null;
  
  const { data: booking, isLoading: bookingLoading } = useGetBookingForTracking(bookingIdBigInt, true);
  const { data: location, isLoading: locationLoading } = useGetDriverLocation(bookingIdBigInt, true);

  if (!isAuthenticated) {
    return <AuthRequiredScreen />;
  }

  if (!bookingId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>Invalid booking ID</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (bookingLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>Booking not found or you don't have permission to view it</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isAccepted = booking.status === BookingStatus.accepted;
  const hasLocation = !!location;

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    const statusMap: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      [BookingStatus.pending]: { label: 'Pending', variant: 'secondary' },
      [BookingStatus.accepted]: { label: 'Accepted', variant: 'default' },
      [BookingStatus.completed]: { label: 'Completed', variant: 'outline' },
      [BookingStatus.cancelled]: { label: 'Cancelled', variant: 'destructive' },
      [BookingStatus.refused]: { label: 'Refused', variant: 'destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline' };

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-8">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Track Your Ride</h1>
              <p className="mt-1 text-muted-foreground">
                Booking #{booking.id.toString()}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Map/Tracking View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                  Driver Location
                </CardTitle>
                <CardDescription>
                  {isAccepted && hasLocation
                    ? 'Live tracking updates every 5 seconds'
                    : 'Tracking will be available after a driver accepts your booking'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isAccepted ? (
                  <Alert>
                    <AlertDescription>
                      Your booking is pending. Tracking will be available once a driver accepts your ride.
                    </AlertDescription>
                  </Alert>
                ) : !hasLocation ? (
                  <Alert>
                    <AlertDescription>
                      Driver location not yet available. The driver will update their location shortly.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <SchematicTrackingMap location={location} />
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Latitude:</span>
                          <span className="font-mono font-medium">{location.latitude.toFixed(6)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Longitude:</span>
                          <span className="font-mono font-medium">{location.longitude.toFixed(6)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-muted-foreground">Last Updated:</span>
                          <span className="font-medium">{new Date().toLocaleTimeString('en-US')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Your ride information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Trip Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Trip Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Pickup</p>
                          <p className="text-sm text-muted-foreground break-words">
                            {booking.pickup_address}
                          </p>
                          <p className="text-xs text-muted-foreground">{booking.pickup_postal_code}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Destination</p>
                          <p className="text-sm text-muted-foreground break-words">
                            {booking.destination_address}
                          </p>
                          <p className="text-xs text-muted-foreground">{booking.destination_postal_code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Pickup Time</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.pickup_time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">
                          {booking.first_name} {booking.last_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{booking.phone_number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Assignment */}
                  {booking.assigned_driver && (
                    <div className="space-y-2 pt-4 border-t">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Driver Assigned</h3>
                      <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3">
                        <p className="text-sm text-green-900 dark:text-green-100">
                          A driver has been assigned to your booking
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
