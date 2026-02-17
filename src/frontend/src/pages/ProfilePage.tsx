import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile, getProfileDisplayName } from '../hooks/useCallerProfile';
import { useGetReferralCode, useGetReferralBonus, useApplyReferralCode } from '../hooks/useReferral';
import { useGetCallerAttachment, useUploadAttachment } from '../hooks/useAttachments';
import { Variant_cab_driver } from '../backend';
import AuthRequiredScreen from '../components/AuthRequiredScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { User, Gift, Upload, FileText, Download, CheckCircle, AlertCircle, Loader2, Copy, Check } from 'lucide-react';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: referralCode, isLoading: referralCodeLoading } = useGetReferralCode();
  const { data: referralBonus, isLoading: referralBonusLoading } = useGetReferralBonus();
  const { data: cabAttachment, isLoading: cabAttachmentLoading } = useGetCallerAttachment(Variant_cab_driver.cab);
  const { data: driverAttachment, isLoading: driverAttachmentLoading } = useGetCallerAttachment(Variant_cab_driver.driver);
  
  const saveProfile = useSaveCallerUserProfile();
  const applyReferralCode = useApplyReferralCode();
  const uploadAttachment = useUploadAttachment();

  const [name, setName] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referralError, setReferralError] = useState('');
  const [referralSuccess, setReferralSuccess] = useState(false);
  const [cabUploadProgress, setCabUploadProgress] = useState(0);
  const [driverUploadProgress, setDriverUploadProgress] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const isAuthenticated = !!identity;

  // Initialize name from profile
  if (userProfile && !name) {
    setName(getProfileDisplayName(userProfile));
  }

  if (!isAuthenticated) {
    return <AuthRequiredScreen />;
  }

  const handleSaveProfile = async () => {
    if (!name.trim() || !userProfile) return;
    
    try {
      if (userProfile.__kind__ === 'customer') {
        await saveProfile.mutateAsync({
          __kind__: 'customer',
          customer: { name: name.trim() },
        });
      } else if (userProfile.__kind__ === 'driver') {
        await saveProfile.mutateAsync({
          __kind__: 'driver',
          driver: {
            ...userProfile.driver,
            fullName: name.trim(),
          },
        });
      }
    } catch (error: any) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleApplyReferralCode = async () => {
    if (!referralCodeInput.trim()) return;
    
    setReferralError('');
    setReferralSuccess(false);
    
    try {
      await applyReferralCode.mutateAsync(referralCodeInput.trim());
      setReferralSuccess(true);
      setReferralCodeInput('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to apply referral code';
      if (errorMessage.includes('already applied')) {
        setReferralError('You have already applied a referral code');
      } else if (errorMessage.includes('own referral code')) {
        setReferralError('You cannot use your own referral code');
      } else if (errorMessage.includes('Invalid referral code')) {
        setReferralError('Invalid referral code');
      } else {
        setReferralError(errorMessage);
      }
    }
  };

  const handleFileUpload = async (
    attachmentType: Variant_cab_driver,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const setProgress = attachmentType === Variant_cab_driver.cab ? setCabUploadProgress : setDriverUploadProgress;
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await uploadAttachment.mutateAsync({
        attachmentType,
        file: uint8Array,
        name: file.name,
        contentType: file.type,
        onProgress: (percentage) => setProgress(percentage),
      });

      setProgress(100);
      setTimeout(() => setProgress(0), 2000);
    } catch (error: any) {
      console.error('Failed to upload attachment:', error);
      setProgress(0);
    }
  };

  const handleDownloadAttachment = async (attachment: any) => {
    try {
      const bytes = await attachment.blob.getBytes();
      const blob = new Blob([bytes], { type: attachment.contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download attachment:', error);
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const hasAppliedReferral = referralBonus !== null;
  const currentDisplayName = userProfile ? getProfileDisplayName(userProfile) : '';

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="mt-1 text-muted-foreground">
                Manage your account settings and referrals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        disabled={saveProfile.isPending}
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={!name.trim() || saveProfile.isPending || name === currentDisplayName}
                    >
                      {saveProfile.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Referral System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Referral Program
                </CardTitle>
                <CardDescription>Share your code and earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Your Referral Code */}
                <div className="space-y-2">
                  <Label>Your Referral Code</Label>
                  {referralCodeLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={referralCode || ''}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyReferralCode}
                      >
                        {copiedCode ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Share this code with friends to earn referral bonuses
                  </p>
                </div>

                <Separator />

                {/* Apply Referral Code */}
                <div className="space-y-2">
                  <Label htmlFor="referralCode">Apply a Referral Code</Label>
                  {hasAppliedReferral ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        You have already applied a referral code
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          id="referralCode"
                          value={referralCodeInput}
                          onChange={(e) => setReferralCodeInput(e.target.value)}
                          placeholder="Enter referral code"
                          disabled={applyReferralCode.isPending}
                        />
                        <Button
                          onClick={handleApplyReferralCode}
                          disabled={!referralCodeInput.trim() || applyReferralCode.isPending}
                        >
                          {applyReferralCode.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      </div>
                      {referralError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{referralError}</AlertDescription>
                        </Alert>
                      )}
                      {referralSuccess && (
                        <Alert>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription>
                            Referral code applied successfully!
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>

                <Separator />

                {/* Referral Bonuses */}
                <div className="space-y-3">
                  <Label>Your Referral Bonuses</Label>
                  {referralBonusLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Customer Bonus</p>
                            <p className="text-2xl font-bold text-primary">
                              ₹{referralBonus?.customerBonus?.toString() || '0'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Driver Bonus</p>
                            <p className="text-2xl font-bold text-primary">
                              ₹{referralBonus?.driverBonus?.toString() || '0'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
                <CardDescription>Upload and manage your documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cab Attachment */}
                <div className="space-y-3">
                  <Label>Cab Attachment</Label>
                  {cabAttachmentLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : cabAttachment ? (
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{cabAttachment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {cabAttachment.contentType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {new Date(Number(cabAttachment.uploadTime) / 1000000).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadAttachment(cabAttachment)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No cab attachment uploaded
                    </div>
                  )}
                  <div className="space-y-2">
                    <Input
                      type="file"
                      onChange={(e) => handleFileUpload(Variant_cab_driver.cab, e)}
                      disabled={uploadAttachment.isPending}
                      accept="image/*,.pdf"
                    />
                    {cabUploadProgress > 0 && cabUploadProgress < 100 && (
                      <Progress value={cabUploadProgress} />
                    )}
                  </div>
                </div>

                <Separator />

                {/* Driver Attachment */}
                <div className="space-y-3">
                  <Label>Driver Attachment</Label>
                  {driverAttachmentLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : driverAttachment ? (
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{driverAttachment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {driverAttachment.contentType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {new Date(Number(driverAttachment.uploadTime) / 1000000).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadAttachment(driverAttachment)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No driver attachment uploaded
                    </div>
                  )}
                  <div className="space-y-2">
                    <Input
                      type="file"
                      onChange={(e) => handleFileUpload(Variant_cab_driver.driver, e)}
                      disabled={uploadAttachment.isPending}
                      accept="image/*,.pdf"
                    />
                    {driverUploadProgress > 0 && driverUploadProgress < 100 && (
                      <Progress value={driverUploadProgress} />
                    )}
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
