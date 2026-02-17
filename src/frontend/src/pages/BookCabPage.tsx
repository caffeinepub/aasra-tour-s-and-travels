import { useState } from 'react';
import { useSubmitBooking } from '../hooks/useQueries';
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
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <Alert className="border-primary bg-primary/5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <AlertTitle className="text-xl font-bold">Booking Confirmed!</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <p>
                    Thank you for choosing Aasra tour's and travels. Your booking has been successfully submitted.
                  </p>
                  <p className="text-lg font-semibold">
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
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Book a Cab</h1>
            <p className="text-lg text-muted-foreground">
              Fill in your details and we'll get back to you shortly
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12">
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
                    <h3 className="text-lg font-semibold">Personal Information</h3>
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
                    <h3 className="text-lg font-semibold">Trip Details</h3>
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
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type *</Label>
                      <Select value={formData.vehicleType} onValueChange={(value) => handleChange('vehicleType', value)}>
                        <SelectTrigger id="vehicleType">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hatchback">Hatchback (4 passengers)</SelectItem>
                          <SelectItem value="sedan">Sedan (4 passengers)</SelectItem>
                          <SelectItem value="suv">SUV (6-7 passengers)</SelectItem>
                          <SelectItem value="luxury-sedan">Luxury Sedan (4 passengers)</SelectItem>
                          <SelectItem value="mini-van">Mini Van (8-10 passengers)</SelectItem>
                          <SelectItem value="tempo-traveller">Tempo Traveller (12-17 passengers)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError error={errors.vehicleType} />
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Options</h3>
                    <div className="space-y-3">
                      <Label>Select Payment Method *</Label>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleChange('paymentMethod', value)}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex-1 cursor-pointer font-normal">
                            <div className="font-medium">Cash</div>
                            <div className="text-sm text-muted-foreground">Pay with cash to the driver</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex-1 cursor-pointer font-normal">
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-muted-foreground">Pay via UPI (Google Pay, PhonePe, Paytm, etc.)</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer font-normal">
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">Pay with your credit or debit card</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50">
                          <RadioGroupItem value="netbanking" id="netbanking" />
                          <Label htmlFor="netbanking" className="flex-1 cursor-pointer font-normal">
                            <div className="font-medium">Net Banking</div>
                            <div className="text-sm text-muted-foreground">Pay via online banking</div>
                          </Label>
                        </div>
                      </RadioGroup>
                      <FieldError error={errors.paymentMethod} />
                    </div>
                  </div>

                  {/* Service Ratings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Service Ratings</h3>
                    <p className="text-sm text-muted-foreground">
                      If you've used our service before, please rate your experience (optional)
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <StarRating
                        id="cabRating"
                        label="Cab Service Rating (1-5)"
                        value={formData.cabRating}
                        onChange={(rating) => handleChange('cabRating', rating)}
                        error={errors.cabRating}
                      />
                      <StarRating
                        id="driverRating"
                        label="Driver Service Rating (1-5)"
                        value={formData.driverRating}
                        onChange={(rating) => handleChange('driverRating', rating)}
                        error={errors.driverRating}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="comments">Special Requests or Comments</Label>
                      <Textarea
                        id="comments"
                        value={formData.comments}
                        onChange={(e) => handleChange('comments', e.target.value)}
                        placeholder="Any special requirements, luggage details, or additional information..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitBooking.isPending}
                      className="min-w-[200px]"
                    >
                      {submitBooking.isPending ? 'Submitting...' : 'Submit Booking'}
                    </Button>
                  </div>

                  {submitBooking.isError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Failed to submit booking. Please try again or contact support.
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
