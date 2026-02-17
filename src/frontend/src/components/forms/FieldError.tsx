import { AlertCircle } from 'lucide-react';

interface FieldErrorProps {
  error?: string;
}

export default function FieldError({ error }: FieldErrorProps) {
  if (!error) return null;

  return (
    <div className="flex items-center gap-1 text-sm text-destructive">
      <AlertCircle className="h-3 w-3" />
      <span>{error}</span>
    </div>
  );
}
