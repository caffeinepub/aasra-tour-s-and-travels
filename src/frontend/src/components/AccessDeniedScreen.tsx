import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LoginButton from './LoginButton';

export default function AccessDeniedScreen() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="max-w-md space-y-6 text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
        <Alert variant="destructive">
          <AlertTitle className="text-lg">Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You do not have permission to view this page. Please sign in with an authorized admin account.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
