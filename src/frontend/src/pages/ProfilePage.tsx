import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useCallerProfile';
import { useGenerateReferralCode, useGetReferralBonus, useApplyReferralCode } from '../hooks/useReferral';
import { useGetCallerAttachment, useUploadAttachment } from '../hooks/useAttachments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Copy, CheckCircle2, Upload, Download, Gift, AlertCircle } from 'lucide-react';
import { PAYMENT_METHODS, getPaymentMethodLabel } from '../utils/paymentMethods';
import { Variant_cab_driver } from '../backend';
import AuthRequiredScreen from '../components/AuthRequiredScreen';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const generateCode = useGenerateReferralCode();
  const { data: referralBonus } = useGetReferralBonus();
  const applyCode = useApplyReferralCode();

  const { data: cabAttachment } = useGetCallerAttachment(Variant_cab_driver.cab);
  const { data: driverAttachment } = useGetCallerAttachment(Variant_cab_driver.driver);
  const uploadAttachment = useUploadAttachment();

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [codeToApply, setCodeToApply] = useState<string>('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [cabUploadProgress, setCabUploadProgress] = useState<number>(0);
  const [driverUploadProgress, setDriverUploadProgress] = useState<number>(0);

  if (!identity) {
    return <AuthRequiredScreen />;
  }

  if (profileLoading) {
    return (
      <div className="flex flex-col">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  const isCustomer = userProfile?.__kind__ === 'customer';
  const currentPaymentMethod = isCustomer ? userProfile.customer.preferredPaymentMethod : undefined;

  const handleSavePaymentMethod = async () => {
    if (!userProfile || !isCustomer) return;

    const updatedProfile = {
      __kind__: 'customer' as const,
      customer: {
        ...userProfile.customer,
        preferredPaymentMethod: paymentMethod as any,
      },
    };

    await saveProfile.mutateAsync(updatedProfile);
    setPaymentMethod('');
  };

  const handleGenerateCode = async () => {
    const code = await generateCode.mutateAsync();
    setReferralCode(code);
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleApplyCode = async () => {
    if (!codeToApply.trim()) return;
    await applyCode.mutateAsync(codeToApply.trim());
    setCodeToApply('');
  };

  const handleFileUpload = async (type: Variant_cab_driver, file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const newArrayBuffer = new ArrayBuffer(uint8Array.length);
    const newUint8Array = new Uint8Array(newArrayBuffer);
    newUint8Array.set(uint8Array);

    const blob = (window as any).ExternalBlob
      .fromBytes(newUint8Array)
      .withUploadProgress((percentage: number) => {
        if (type === Variant_cab_driver.cab) {
          setCabUploadProgress(percentage);
        } else {
          setDriverUploadProgress(percentage);
        }
      });

    await uploadAttachment.mutateAsync({
      attachmentType: type,
      file: blob,
      name: file.name,
      contentType: file.type,
    });

    if (type === Variant_cab_driver.cab) {
      setCabUploadProgress(0);
    } else {
      setDriverUploadProgress(0);
    }
  };

  const handleDownload = async (type: Variant_cab_driver) => {
    const attachment = type === Variant_cab_driver.cab ? cabAttachment : driverAttachment;
    if (!attachment) return;

    const bytes = await attachment.blob.getBytes();
    const blob = new Blob([bytes], { type: attachment.contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-8 dark:from-amber-950/20 dark:to-orange-950/20 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:mb-4 sm:text-4xl lg:text-5xl">My Profile</h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Manage your preferences and referral rewards
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Payment Method (Customer Only) */}
            {isCustomer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Payment Preference</CardTitle>
                  <CardDescription>
                    Set your preferred payment method for faster bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPaymentMethod && (
                    <Alert>
                      <CheckCircle2 className="h-5 w-5" />
                      <AlertTitle>Current Preference</AlertTitle>
                      <AlertDescription>
                        {getPaymentMethodLabel(currentPaymentMethod)}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label>Select Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-3 sm:grid-cols-2">
                      {PAYMENT_METHODS.map((method) => (
                        <div key={method.value} className="flex items-start space-x-3 rounded-lg border p-3">
                          <RadioGroupItem value={method.value} id={`profile-${method.value}`} className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor={`profile-${method.value}`} className="cursor-pointer font-medium">
                              {method.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={handleSavePaymentMethod}
                    disabled={!paymentMethod || saveProfile.isPending}
                    className="w-full sm:w-auto"
                  >
                    {saveProfile.isPending ? 'Saving...' : 'Save Preference'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Referral System */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg sm:text-xl">Referral Program</CardTitle>
                </div>
                <CardDescription>
                  Earn rewards by referring friends and family
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Generate Code */}
                <div className="space-y-3">
                  <Label>Your Referral Code</Label>
                  {referralCode ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input value={referralCode} readOnly className="flex-1 font-mono" />
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        {codeCopied ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerateCode}
                      disabled={generateCode.isPending}
                      className="w-full sm:w-auto"
                    >
                      {generateCode.isPending ? 'Generating...' : 'Generate Referral Code'}
                    </Button>
                  )}
                </div>

                {/* Bonus Balance */}
                {referralBonus && (
                  <Alert className="border-primary bg-primary/5">
                    <Gift className="h-5 w-5 text-primary" />
                    <AlertTitle>Your Rewards</AlertTitle>
                    <AlertDescription className="mt-2 space-y-1">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span>Customer Bonus:</span>
                        <span className="font-semibold">₹{referralBonus.customerBonus.toString()}</span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span>Driver Bonus:</span>
                        <span className="font-semibold">₹{referralBonus.driverBonus.toString()}</span>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Apply Code */}
                <div className="space-y-3 border-t pt-4">
                  <Label htmlFor="applyCode">Apply Referral Code</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="applyCode"
                      value={codeToApply}
                      onChange={(e) => setCodeToApply(e.target.value)}
                      placeholder="Enter referral code"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyCode}
                      disabled={!codeToApply.trim() || applyCode.isPending}
                      className="w-full sm:w-auto"
                    >
                      {applyCode.isPending ? 'Applying...' : 'Apply Code'}
                    </Button>
                  </div>
                  {applyCode.isSuccess && (
                    <Alert>
                      <CheckCircle2 className="h-5 w-5" />
                      <AlertDescription>Referral code applied successfully!</AlertDescription>
                    </Alert>
                  )}
                  {applyCode.isError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-5 w-5" />
                      <AlertDescription>
                        Failed to apply code. Please check and try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Documents</CardTitle>
                <CardDescription>
                  Upload and manage your cab and driver documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cab Attachment */}
                <div className="space-y-3">
                  <Label>Cab Documents</Label>
                  {cabAttachment ? (
                    <div className="space-y-2">
                      <Alert>
                        <CheckCircle2 className="h-5 w-5" />
                        <AlertDescription className="break-words">
                          Uploaded: {cabAttachment.name}
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={() => handleDownload(Variant_cab_driver.cab)}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(Variant_cab_driver.cab, file);
                        }}
                        disabled={uploadAttachment.isPending}
                      />
                      {cabUploadProgress > 0 && (
                        <div className="space-y-1">
                          <Progress value={cabUploadProgress} />
                          <p className="text-xs text-muted-foreground text-center">
                            Uploading: {cabUploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Driver Attachment */}
                <div className="space-y-3">
                  <Label>Driver Documents</Label>
                  {driverAttachment ? (
                    <div className="space-y-2">
                      <Alert>
                        <CheckCircle2 className="h-5 w-5" />
                        <AlertDescription className="break-words">
                          Uploaded: {driverAttachment.name}
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={() => handleDownload(Variant_cab_driver.driver)}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(Variant_cab_driver.driver, file);
                        }}
                        disabled={uploadAttachment.isPending}
                      />
                      {driverUploadProgress > 0 && (
                        <div className="space-y-1">
                          <Progress value={driverUploadProgress} />
                          <p className="text-xs text-muted-foreground text-center">
                            Uploading: {driverUploadProgress}%
                          </p>
                        </div>
                      )}
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
