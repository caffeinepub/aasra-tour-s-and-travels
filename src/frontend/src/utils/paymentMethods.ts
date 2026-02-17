import { PaymentMethod } from '../backend';

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    value: PaymentMethod.cash,
    label: 'Cash',
    description: 'Pay with cash to the driver',
  },
  {
    value: PaymentMethod.UPI,
    label: 'UPI',
    description: 'Pay via UPI (Google Pay, PhonePe, Paytm, etc.)',
  },
  {
    value: PaymentMethod.creditCard,
    label: 'Credit Card',
    description: 'Pay with your credit card',
  },
  {
    value: PaymentMethod.debitCard,
    label: 'Debit Card',
    description: 'Pay with your debit card',
  },
];

export function getPaymentMethodLabel(method: PaymentMethod | undefined): string {
  if (!method) return 'Not set';
  const option = PAYMENT_METHODS.find((pm) => pm.value === method);
  return option?.label || 'Unknown';
}
