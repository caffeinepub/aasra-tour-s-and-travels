import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCallerProfile';
import { useGetBookingForTracking } from '../hooks/useTracking';
import { useUpdateDriverLocation } from '../hooks/useDriverLocationUpdate';
import AuthRequiredScreen from '../components/AuthRequiredScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Loader2, ArrowLeft, Navigation } from 'lucide-react';
import type { Location } from '../backend';

export default function DriverLocationUpdatePage() {
  const { bookingId } = useParams({ strict: false }) as { bookingId?: string };
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const bookingIdBigInt = bookingId ? BigInt(bookingId) : null;
  const { data: booking, isLoading: bookingLoading } = useGetBookingForTracking(bookingIdBigInt, false);
  const updateLocationMutation = useUpdateDriverLocation();

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');

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

  if (profileLoading || bookingLoading) {
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
          <AlertDescription>
            You must have a driver profile to update location. Only drivers can access this page.
          </AlertDescription>
        </Alert>
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

  const isAssignedDriver = booking.assigned_driver && identity
    ? booking.assigned_driver.toString() === identity.getPrincipal().toString()
    : false;

  if (!isAssignedDriver) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>
            You are not the assigned driver for this booking. Only the assigned driver can update location.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid latitude and longitude values');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    const location: Location = {
      latitude: lat,
      longitude: lng,
    };

    try {
      await updateLocationMutation.mutateAsync({
        bookingId: bookingIdBigInt!,
        location,
      });
      setLatitude('');
      setLongitude('');
    } catch (err: any) {
      setError(err.message || 'Failed to update location');
    }
  };

  const currentLocation = booking.driver_location;

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
          <div>
            <h1 className="text-3xl font-bold">Update Driver Location</h1>
            <p className="mt-1 text-muted-foreground">
              Booking #{booking.id.toString()}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="space-y-6">
            {/* Current Location Display */}
            {currentLocation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    Current Location
                  </CardTitle>
                  <CardDescription>Your last reported position</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Latitude:</span>
                        <span className="font-mono font-medium">{currentLocation.latitude.toFixed(6)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Longitude:</span>
                        <span className="font-mono font-medium">{currentLocation.longitude.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Update Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                  Update Your Location
                </CardTitle>
                <CardDescription>
                  Enter your current latitude and longitude coordinates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 17.385044"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      disabled={updateLocationMutation.isPending}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Value between -90 and 90
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 78.486671"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      disabled={updateLocationMutation.isPending}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Value between -180 and 180
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {updateLocationMutation.isSuccess && (
                    <Alert>
                      <AlertDescription>Location updated successfully!</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={updateLocationMutation.isPending}
                    className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                  >
                    {updateLocationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Update Location
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>Note:</strong> The customer will see your updated location within 5 seconds on their tracking screen.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>Booking information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">
                      {booking.first_name} {booking.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pickup</p>
                    <p className="font-medium">{booking.pickup_address}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Destination</p>
                    <p className="font-medium">{booking.destination_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
