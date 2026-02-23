import { useState } from 'react';
import { useGetAllBookings, useAssignDriver, useUpdateBookingStatus } from '../../hooks/useQueries';
import { useGetRateCard, useUpdateRateCard } from '../../hooks/useRateCard';
import { useAdminGuard } from '../../hooks/useAdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Clock, User, Phone, Mail, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import AccessDeniedScreen from '../../components/AccessDeniedScreen';
import { BookingStatus, type BookingRequestView, type RateCard } from '../../backend';
import { validatePrincipalText } from '../../utils/principalText';

export default function AdminBookingsPage() {
  const { isLoading: guardLoading, isAdmin } = useAdminGuard();
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookings();
  const { data: rateCard, isLoading: rateCardLoading } = useGetRateCard();
  const updateRateCard = useUpdateRateCard();
  const assignDriver = useAssignDriver();
  const updateStatus = useUpdateBookingStatus();

  const [selectedBookingId, setSelectedBookingId] = useState<bigint | null>(null);
  const [driverPrincipalText, setDriverPrincipalText] = useState('');
  const [principalError, setPrincipalError] = useState('');
  const [editedRates, setEditedRates] = useState<RateCard | null>(null);

  if (guardLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const selectedBooking = bookings?.find((b) => b.id === selectedBookingId);

  const handleAssignDriver = async () => {
    if (!selectedBookingId) return;

    setPrincipalError('');
    const result = validatePrincipalText(driverPrincipalText);

    if (!result.valid) {
      setPrincipalError(result.error || 'Invalid principal');
      return;
    }

    try {
      await assignDriver.mutateAsync({
        bookingId: selectedBookingId,
        driverPrincipal: result.principal!,
      });
      setDriverPrincipalText('');
      setPrincipalError('');
    } catch (error: any) {
      setPrincipalError(error.message || 'Failed to assign driver');
    }
  };

  const handleUpdateStatus = async (bookingId: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ bookingId, status });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSaveRateCard = async () => {
    if (!editedRates) return;
    try {
      await updateRateCard.mutateAsync(editedRates);
      setEditedRates(null);
    } catch (error) {
      console.error('Failed to update rate card:', error);
    }
  };

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

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage bookings and rate card</p>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* Rate Card */}
            <Card>
              <CardHeader>
                <CardTitle>Rate Card (₹/km)</CardTitle>
                <CardDescription>Update per-kilometer rates for each vehicle type</CardDescription>
              </CardHeader>
              <CardContent>
                {rateCardLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="mini">Mini</Label>
                        <Input
                          id="mini"
                          type="number"
                          value={editedRates?.mini.toString() || rateCard?.mini.toString() || ''}
                          onChange={(e) =>
                            setEditedRates({
                              ...(editedRates || rateCard!),
                              mini: BigInt(e.target.value || 0),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sedan">Sedan</Label>
                        <Input
                          id="sedan"
                          type="number"
                          value={editedRates?.sedan.toString() || rateCard?.sedan.toString() || ''}
                          onChange={(e) =>
                            setEditedRates({
                              ...(editedRates || rateCard!),
                              sedan: BigInt(e.target.value || 0),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="suv">SUV</Label>
                        <Input
                          id="suv"
                          type="number"
                          value={editedRates?.suv.toString() || rateCard?.suv.toString() || ''}
                          onChange={(e) =>
                            setEditedRates({
                              ...(editedRates || rateCard!),
                              suv: BigInt(e.target.value || 0),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="premiumSuv">Premium SUV</Label>
                        <Input
                          id="premiumSuv"
                          type="number"
                          value={editedRates?.premiumSuv.toString() || rateCard?.premiumSuv.toString() || ''}
                          onChange={(e) =>
                            setEditedRates({
                              ...(editedRates || rateCard!),
                              premiumSuv: BigInt(e.target.value || 0),
                            })
                          }
                        />
                      </div>
                    </div>
                    {editedRates && (
                      <div className="flex gap-2">
                        <Button onClick={handleSaveRateCard} disabled={updateRateCard.isPending}>
                          {updateRateCard.isPending ? 'Saving...' : 'Save Rate Card'}
                        </Button>
                        <Button variant="outline" onClick={() => setEditedRates(null)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bookings */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Bookings List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">All Bookings</h2>
                {bookingsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : !bookings || bookings.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>No Bookings</AlertTitle>
                    <AlertDescription>There are no booking requests yet.</AlertDescription>
                  </Alert>
                ) : (
                  <ScrollArea className="h-[calc(100vh-24rem)]">
                    <div className="space-y-3 pr-4">
                      {bookings.map((booking) => {
                        const pickupDate = new Date(Number(booking.pickup_time));
                        const isSelected = selectedBookingId === booking.id;

                        return (
                          <Card
                            key={booking.id.toString()}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              isSelected ? 'border-2 border-primary' : ''
                            }`}
                            onClick={() => setSelectedBookingId(booking.id)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <CardTitle className="text-base">
                                    Booking #{booking.id.toString()}
                                  </CardTitle>
                                  <CardDescription>
                                    {booking.first_name} {booking.last_name}
                                  </CardDescription>
                                </div>
                                <Badge variant={getStatusBadgeVariant(booking.status)}>
                                  {getStatusLabel(booking.status)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                                <p className="text-muted-foreground">{booking.pickup_address}</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Clock className="mt-0.5 h-4 w-4 text-primary" />
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
                )}
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                {selectedBooking ? (
                  <>
                    <h2 className="text-xl font-semibold">Booking Details</h2>
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle>Booking #{selectedBooking.id.toString()}</CardTitle>
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
                            <MapPin className="mt-1 h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Pickup</p>
                              <p className="font-semibold">{selectedBooking.pickup_address}</p>
                              {selectedBooking.pickup_postal_code && (
                                <p className="text-xs text-muted-foreground">{selectedBooking.pickup_postal_code}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin className="mt-1 h-5 w-5 text-destructive" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Destination</p>
                              <p className="font-semibold">{selectedBooking.destination_address}</p>
                              {selectedBooking.destination_postal_code && (
                                <p className="text-xs text-muted-foreground">{selectedBooking.destination_postal_code}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="mt-1 h-5 w-5 text-primary" />
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
                            <User className="mt-1 h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Passenger</p>
                              <p className="font-semibold">
                                {selectedBooking.first_name} {selectedBooking.last_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Phone className="mt-1 h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Phone</p>
                              <p className="font-semibold">{selectedBooking.phone_number}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Mail className="mt-1 h-5 w-5 text-primary" />
                            <div>
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
                              <p className="text-sm">{selectedBooking.comments}</p>
                            </div>
                          </>
                        )}

                        {selectedBooking.assigned_driver && (
                          <>
                            <Separator />
                            <Alert>
                              <CheckCircle2 className="h-5 w-5" />
                              <AlertTitle>Assigned Driver</AlertTitle>
                              <AlertDescription className="break-all font-mono text-xs">
                                {selectedBooking.assigned_driver.toString()}
                              </AlertDescription>
                            </Alert>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Assign driver or update booking status</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Assign Driver */}
                        <div className="space-y-2">
                          <Label htmlFor="driverPrincipal">Driver Principal ID</Label>
                          <Input
                            id="driverPrincipal"
                            value={driverPrincipalText}
                            onChange={(e) => {
                              setDriverPrincipalText(e.target.value);
                              setPrincipalError('');
                            }}
                            placeholder="Enter driver principal ID"
                            disabled={assignDriver.isPending}
                          />
                          {principalError && (
                            <Alert variant="destructive">
                              <XCircle className="h-5 w-5" />
                              <AlertDescription>{principalError}</AlertDescription>
                            </Alert>
                          )}
                          <Button
                            onClick={handleAssignDriver}
                            disabled={!driverPrincipalText.trim() || assignDriver.isPending}
                            className="w-full"
                          >
                            {assignDriver.isPending ? 'Assigning...' : selectedBooking.status === BookingStatus.pending ? 'Accept & Assign Driver' : 'Assign Driver'}
                          </Button>
                        </div>

                        <Separator />

                        {/* Status Updates */}
                        <div className="space-y-2">
                          <Label>Update Status</Label>
                          <div className="grid gap-2">
                            <Button
                              onClick={() => handleUpdateStatus(selectedBooking.id, 'accepted')}
                              disabled={updateStatus.isPending || selectedBooking.status === BookingStatus.accepted}
                              variant="default"
                              size="sm"
                            >
                              Mark as Accepted
                            </Button>
                            <Button
                              onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                              disabled={updateStatus.isPending || selectedBooking.status === BookingStatus.completed}
                              variant="secondary"
                              size="sm"
                            >
                              Mark as Completed
                            </Button>
                            <Button
                              onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                              disabled={updateStatus.isPending || selectedBooking.status === BookingStatus.cancelled}
                              variant="destructive"
                              size="sm"
                            >
                              Mark as Cancelled
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Select a Booking</AlertTitle>
                    <AlertDescription>
                      Click on a booking from the list to view details and perform actions.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
