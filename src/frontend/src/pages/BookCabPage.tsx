import { useState, useEffect } from 'react';
import { useSubmitBooking } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useCallerProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FieldError from '../components/forms/FieldError';
import StarRating from '../components/forms/StarRating';
import { CheckCircle2 } from 'lucide-react';
import type { BookingRequest } from '../backend';
import { PAYMENT_METHODS } from '../utils/paymentMethods';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupAddress: string;
  pickupPostalCode: string;
  destinationAddress: string;
  destinationPostalCode: string;
  pickupDate: string;
  pickupTime: string;
  vehicleType: string;
  paymentMethod: string;
  comments: string;
  cabRating: number | null;
  driverRating: number | null;
}

interface FormErrors {
  [key: string]: string;
}

export default function BookCabPage() {
  const submitBooking = useSubmitBooking();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupAddress: '',
    pickupPostalCode: '',
    destinationAddress: '',
    destinationPostalCode: '',
    pickupDate: '',
    pickupTime: '',
    vehicleType: '',
    paymentMethod: '',
    comments: '',
    cabRating: null,
    driverRating: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmationId, setConfirmationId] = useState<bigint | null>(null);

  // Initialize payment method from user profile when loaded
  useEffect(() => {
    if (userProfile && !profileLoading && !formData.paymentMethod) {
      if (userProfile.__kind__ === 'customer' && userProfile.customer.preferredPaymentMethod) {
        setFormData((prev) => ({
          ...prev,
          paymentMethod: userProfile.customer.preferredPaymentMethod as string,
        }));
      }
    }
  }, [userProfile, profileLoading, formData.paymentMethod]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required';
    if (!formData.destinationAddress.trim()) newErrors.destinationAddress = 'Destination address is required';
    if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
    if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    if (!formData.vehicleType) newErrors.vehicleType = 'Please select a vehicle type';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';

    // Validate ratings if provided
    if (formData.cabRating !== null && (formData.cabRating < 1 || formData.cabRating > 5)) {
      newErrors.cabRating = 'Cab rating must be between 1 and 5';
    }
    if (formData.driverRating !== null && (formData.driverRating < 1 || formData.driverRating > 5)) {
      newErrors.driverRating = 'Driver rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const pickupTimestamp = BigInt(pickupDateTime.getTime());

    const bookingRequest: BookingRequest = {
      id: BigInt(0),
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone_number: formData.phone.trim(),
      pickup_address: formData.pickupAddress.trim(),
      pickup_postal_code: formData.pickupPostalCode.trim(),
      destination_address: formData.destinationAddress.trim(),
      destination_postal_code: formData.destinationPostalCode.trim(),
      pickup_time: pickupTimestamp,
      comments: `Vehicle: ${formData.vehicleType}. ${formData.comments.trim()}`,
      status: { pending: null } as any,
      paymentMethod: formData.paymentMethod,
      submitted_by: '' as any,
      cancel_reason: undefined,
      submit_time: BigInt(Date.now()),
      cab_rating: formData.cabRating !== null ? BigInt(formData.cabRating) : undefined,
      driver_rating: formData.driverRating !== null ? BigInt(formData.driverRating) : undefined,
    };

    try {
      const id = await submitBooking.mutateAsync(bookingRequest);
      setConfirmationId(id);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        pickupAddress: '',
        pickupPostalCode: '',
        destinationAddress: '',
        destinationPostalCode: '',
        pickupDate: '',
        pickupTime: '',
        vehicleType: '',
        paymentMethod: '',
        comments: '',
        cabRating: null,
        driverRating: null,
      });
      setErrors({});
    } catch (error) {
      console.error('Booking submission error:', error);
    }
  };

  const handleChange = (field: keyof FormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (confirmationId !== null) {
    return (
      <div className="flex flex-col">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <Alert className="border-primary bg-primary/5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <AlertTitle className="text-lg font-bold sm:text-xl">Booking Confirmed!</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <p>
                    Thank you for choosing Aasra tour's and travels. Your booking has been successfully submitted.
                  </p>
                  <p className="text-base font-semibold sm:text-lg">
                    Confirmation Reference: <span className="text-primary">#{confirmationId.toString()}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please save this reference number for your records. We will contact you shortly to confirm the details.
                  </p>
                </AlertDescription>
              </Alert>
              <div className="mt-6 text-center">
                <Button onClick={() => setConfirmationId(null)} variant="outline">
                  Book Another Cab
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-8 dark:from-amber-950/20 dark:to-orange-950/20 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:mb-4 sm:text-4xl lg:text-5xl">Book a Cab</h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Fill in your details and we'll get back to you shortly
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Please provide accurate information for a smooth booking experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold sm:text-lg">Personal Information</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                        />
                        <FieldError error={errors.firstName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                        />
                        <FieldError error={errors.lastName} />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                        />
                        <FieldError error={errors.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                        <FieldError error={errors.phone} />
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold sm:text-lg">Trip Details</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="pickupAddress">Pickup Address *</Label>
                        <Input
                          id="pickupAddress"
                          value={formData.pickupAddress}
                          onChange={(e) => handleChange('pickupAddress', e.target.value)}
                          placeholder="Enter pickup location"
                        />
                        <FieldError error={errors.pickupAddress} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupPostalCode">Pickup Postal Code</Label>
                        <Input
                          id="pickupPostalCode"
                          value={formData.pickupPostalCode}
                          onChange={(e) => handleChange('pickupPostalCode', e.target.value)}
                          placeholder="Postal code"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="destinationAddress">Destination Address *</Label>
                        <Input
                          id="destinationAddress"
                          value={formData.destinationAddress}
                          onChange={(e) => handleChange('destinationAddress', e.target.value)}
                          placeholder="Enter destination"
                        />
                        <FieldError error={errors.destinationAddress} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destinationPostalCode">Destination Postal Code</Label>
                        <Input
                          id="destinationPostalCode"
                          value={formData.destinationPostalCode}
                          onChange={(e) => handleChange('destinationPostalCode', e.target.value)}
                          placeholder="Postal code"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate">Pickup Date *</Label>
                        <Input
                          id="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={(e) => handleChange('pickupDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <FieldError error={errors.pickupDate} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupTime">Pickup Time *</Label>
                        <Input
                          id="pickupTime"
                          type="time"
                          value={formData.pickupTime}
                          onChange={(e) => handleChange('pickupTime', e.target.value)}
                        />
                        <FieldError error={errors.pickupTime} />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Selection */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold sm:text-lg">Vehicle & Payment</h3>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type *</Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value) => handleChange('vehicleType', value)}
                      >
                        <SelectTrigger id="vehicleType">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mini">Mini (4 seater)</SelectItem>
                          <SelectItem value="sedan">Sedan (4 seater)</SelectItem>
                          <SelectItem value="suv">SUV (6-7 seater)</SelectItem>
                          <SelectItem value="premiumSuv">Premium SUV (6-7 seater)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError error={errors.vehicleType} />
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method *</Label>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleChange('paymentMethod', value)}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <div key={method.value} className="flex items-start space-x-3 rounded-lg border p-3">
                            <RadioGroupItem value={method.value} id={method.value} className="mt-0.5" />
                            <div className="flex-1">
                              <Label htmlFor={method.value} className="cursor-pointer font-medium">
                                {method.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                      <FieldError error={errors.paymentMethod} />
                    </div>
                  </div>

                  {/* Optional Ratings */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold sm:text-lg">Optional Ratings</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="cabRating">Cab Service Rating</Label>
                        <StarRating
                          id="cabRating"
                          label="Cab Service Rating"
                          value={formData.cabRating}
                          onChange={(value) => handleChange('cabRating', value)}
                        />
                        <FieldError error={errors.cabRating} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="driverRating">Driver Service Rating</Label>
                        <StarRating
                          id="driverRating"
                          label="Driver Service Rating"
                          value={formData.driverRating}
                          onChange={(value) => handleChange('driverRating', value)}
                        />
                        <FieldError error={errors.driverRating} />
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    <Label htmlFor="comments">Additional Comments</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => handleChange('comments', e.target.value)}
                      placeholder="Any special requests or instructions..."
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitBooking.isPending}
                  >
                    {submitBooking.isPending ? 'Submitting...' : 'Submit Booking'}
                  </Button>

                  {submitBooking.isError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Failed to submit booking. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
