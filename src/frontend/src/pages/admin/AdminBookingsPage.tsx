import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAdminGuard } from '../../hooks/useAdminGuard';
import { useGetAllBookings, useAssignDriver } from '../../hooks/useQueries';
import { useGetCallerUserProfile, getProfileDisplayName } from '../../hooks/useCallerProfile';
import { useGetRateCard, useUpdateRateCard } from '../../hooks/useRateCard';
import { validatePrincipalText } from '../../utils/principalText';
import AccessDeniedScreen from '../../components/AccessDeniedScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, User, Phone, Mail, MessageSquare, Clock, CreditCard, Star, IndianRupee, Loader2, UserCheck } from 'lucide-react';
import type { BookingRequest, RateCard } from '../../backend';
import { BookingStatus } from '../../backend';

export default function AdminBookingsPage() {
  const { identity } = useInternetIdentity();
  const { isAuthenticated, isAdmin, isLoading: guardLoading } = useAdminGuard();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookings();
  const { data: rateCard, isLoading: rateCardLoading } = useGetRateCard();
  const updateRateCardMutation = useUpdateRateCard();
  const assignDriverMutation = useAssignDriver();
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  // Rate card form state
  const [rateCardForm, setRateCardForm] = useState<{
    mini: string;
    sedan: string;
    suv: string;
    premiumSuv: string;
  }>({
    mini: '',
    sedan: '',
    suv: '',
    premiumSuv: '',
  });

  // Driver assignment state
  const [driverPrincipalText, setDriverPrincipalText] = useState('');
  const [driverPrincipalError, setDriverPrincipalError] = useState('');

  // Initialize form when rate card loads
  useState(() => {
    if (rateCard) {
      setRateCardForm({
        mini: rateCard.mini.toString(),
        sedan: rateCard.sedan.toString(),
        suv: rateCard.suv.toString(),
        premiumSuv: rateCard.premiumSuv.toString(),
      });
    }
  });

  // Update form when rate card changes
  if (rateCard && rateCardForm.mini === '' && rateCardForm.sedan === '' && rateCardForm.suv === '' && rateCardForm.premiumSuv === '') {
    setRateCardForm({
      mini: rateCard.mini.toString(),
      sedan: rateCard.sedan.toString(),
      suv: rateCard.suv.toString(),
      premiumSuv: rateCard.premiumSuv.toString(),
    });
  }

  // Show loading while checking authentication
  if (guardLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleRateCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRateCard: RateCard = {
      mini: BigInt(parseInt(rateCardForm.mini) || 0),
      sedan: BigInt(parseInt(rateCardForm.sedan) || 0),
      suv: BigInt(parseInt(rateCardForm.suv) || 0),
      premiumSuv: BigInt(parseInt(rateCardForm.premiumSuv) || 0),
    };

    try {
      await updateRateCardMutation.mutateAsync(newRateCard);
    } catch (error) {
      console.error('Failed to update rate card:', error);
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedBooking) return;

    setDriverPrincipalError('');
    const validation = validatePrincipalText(driverPrincipalText);

    if (!validation.valid) {
      setDriverPrincipalError(validation.error || 'Invalid Principal');
      return;
    }

    try {
      await assignDriverMutation.mutateAsync({
        bookingId: selectedBooking.id,
        driverPrincipal: validation.principal!,
      });
      setDriverPrincipalText('');
      setDriverPrincipalError('');
    } catch (error: any) {
      setDriverPrincipalError(error.message || 'Failed to assign driver');
    }
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

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatPaymentMethod = (method: string | undefined) => {
    if (!method || method.trim() === '') {
      return 'Not provided';
    }
    
    const methodMap: Record<string, string> = {
      cash: 'Cash',
      upi: 'UPI',
      card: 'Credit/Debit Card',
      netbanking: 'Net Banking',
    };

    return methodMap[method.toLowerCase()] || method;
  };

  const renderStarRating = (rating: bigint | undefined) => {
    if (rating === undefined) {
      return <span className="text-sm text-muted-foreground">Not provided</span>;
    }

    const ratingNumber = Number(rating);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= ratingNumber
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-muted-foreground'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{ratingNumber}/5</span>
      </div>
    );
  };

  const displayName = userProfile ? getProfileDisplayName(userProfile) : 'Admin';

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Welcome back, {displayName}
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {bookings?.length || 0} Total Bookings
            </Badge>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {/* Rate Card Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  Rate Card Management
                </CardTitle>
                <CardDescription>Update per-kilometer rates for different vehicle types</CardDescription>
              </CardHeader>
              <CardContent>
                {rateCardLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <form onSubmit={handleRateCardSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="mini">Mini (₹/km)</Label>
                        <Input
                          id="mini"
                          type="number"
                          value={rateCardForm.mini}
                          onChange={(e) => setRateCardForm({ ...rateCardForm, mini: e.target.value })}
                          disabled={updateRateCardMutation.isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sedan">Sedan (₹/km)</Label>
                        <Input
                          id="sedan"
                          type="number"
                          value={rateCardForm.sedan}
                          onChange={(e) => setRateCardForm({ ...rateCardForm, sedan: e.target.value })}
                          disabled={updateRateCardMutation.isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="suv">SUV (₹/km)</Label>
                        <Input
                          id="suv"
                          type="number"
                          value={rateCardForm.suv}
                          onChange={(e) => setRateCardForm({ ...rateCardForm, suv: e.target.value })}
                          disabled={updateRateCardMutation.isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="premiumSuv">Premium SUV (₹/km)</Label>
                        <Input
                          id="premiumSuv"
                          type="number"
                          value={rateCardForm.premiumSuv}
                          onChange={(e) => setRateCardForm({ ...rateCardForm, premiumSuv: e.target.value })}
                          disabled={updateRateCardMutation.isPending}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={updateRateCardMutation.isPending}>
                      {updateRateCardMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Rate Card'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Bookings Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Bookings List */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Requests</CardTitle>
                  <CardDescription>Click on a booking to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : !bookings || bookings.length === 0 ? (
                    <Alert>
                      <AlertDescription>No booking requests yet</AlertDescription>
                    </Alert>
                  ) : (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-3">
                        {bookings.map((booking) => (
                          <Card
                            key={booking.id.toString()}
                            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                              selectedBooking?.id === booking.id ? 'border-primary' : ''
                            }`}
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <p className="font-medium">
                                    {booking.first_name} {booking.last_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.pickup_address}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(booking.submit_time)}
                                  </p>
                                </div>
                                {getStatusBadge(booking.status)}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>
                    {selectedBooking ? `Booking #${selectedBooking.id}` : 'Select a booking to view details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedBooking ? (
                    <Alert>
                      <AlertDescription>
                        Select a booking from the list to view its details
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-6">
                        {/* Driver Assignment Section */}
                        <div className="space-y-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                          <h3 className="font-semibold flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Accept & Assign Driver
                          </h3>
                          
                          {selectedBooking.assigned_driver ? (
                            <div className="space-y-2">
                              <Alert>
                                <AlertDescription>
                                  <strong>Driver Assigned:</strong>
                                  <br />
                                  <span className="font-mono text-xs break-all">
                                    {selectedBooking.assigned_driver.toString()}
                                  </span>
                                </AlertDescription>
                              </Alert>
                              <p className="text-sm text-muted-foreground">
                                Status: {getStatusBadge(selectedBooking.status)}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="driverPrincipal">Driver Principal ID</Label>
                                <Input
                                  id="driverPrincipal"
                                  type="text"
                                  placeholder="Enter driver's Principal ID"
                                  value={driverPrincipalText}
                                  onChange={(e) => {
                                    setDriverPrincipalText(e.target.value);
                                    setDriverPrincipalError('');
                                  }}
                                  disabled={assignDriverMutation.isPending}
                                  className="font-mono text-sm"
                                />
                                {driverPrincipalError && (
                                  <p className="text-sm text-destructive">{driverPrincipalError}</p>
                                )}
                              </div>
                              <Button
                                onClick={handleAssignDriver}
                                disabled={assignDriverMutation.isPending || !driverPrincipalText.trim()}
                                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                              >
                                {assignDriverMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Assigning...
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Accept & Assign Driver
                                  </>
                                )}
                              </Button>
                              <p className="text-xs text-muted-foreground">
                                This will accept the booking and assign it to the specified driver
                              </p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Customer Information */}
                        <div className="space-y-3">
                          <h3 className="font-semibold">Customer Information</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {selectedBooking.first_name} {selectedBooking.last_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedBooking.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedBooking.phone_number}</span>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Trip Details */}
                        <div className="space-y-3">
                          <h3 className="font-semibold">Trip Details</h3>
                          <div className="space-y-3 text-sm">
                            <div>
                              <div className="flex items-start gap-2 mb-1">
                                <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                                <span className="font-medium">Pickup</span>
                              </div>
                              <p className="ml-6 text-muted-foreground">
                                {selectedBooking.pickup_address}
                              </p>
                              <p className="ml-6 text-xs text-muted-foreground">
                                {selectedBooking.pickup_postal_code}
                              </p>
                            </div>
                            <div>
                              <div className="flex items-start gap-2 mb-1">
                                <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                                <span className="font-medium">Destination</span>
                              </div>
                              <p className="ml-6 text-muted-foreground">
                                {selectedBooking.destination_address}
                              </p>
                              <p className="ml-6 text-xs text-muted-foreground">
                                {selectedBooking.destination_postal_code}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="font-medium">Pickup Time: </span>
                                <span className="text-muted-foreground">
                                  {formatDate(selectedBooking.pickup_time)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Booking Information */}
                        <div className="space-y-3">
                          <h3 className="font-semibold">Booking Information</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="font-medium">Submitted: </span>
                                <span className="text-muted-foreground">
                                  {formatDate(selectedBooking.submit_time)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="font-medium">Payment: </span>
                                <span className="text-muted-foreground">
                                  {formatPaymentMethod(selectedBooking.paymentMethod)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ratings */}
                        {(selectedBooking.driver_rating || selectedBooking.cab_rating) && (
                          <>
                            <Separator />
                            <div className="space-y-3">
                              <h3 className="font-semibold">Ratings</h3>
                              <div className="space-y-2">
                                {selectedBooking.driver_rating && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">Driver Service</p>
                                    {renderStarRating(selectedBooking.driver_rating)}
                                  </div>
                                )}
                                {selectedBooking.cab_rating && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">Cab Condition</p>
                                    {renderStarRating(selectedBooking.cab_rating)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Comments */}
                        {selectedBooking.comments && (
                          <>
                            <Separator />
                            <div className="space-y-2">
                              <h3 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Comments
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedBooking.comments}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
