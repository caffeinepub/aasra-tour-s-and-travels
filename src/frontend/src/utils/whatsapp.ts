import { businessInfo } from '../content/businessInfo';

/**
 * Normalizes a phone number for WhatsApp wa.me links by removing non-digit characters
 */
function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Gets the WhatsApp number from businessInfo, falling back to phone if whatsapp is not set
 */
export function getWhatsAppNumber(): string {
  const number = businessInfo.whatsapp ?? businessInfo.phone;
  return normalizePhoneNumber(number);
}

/**
 * Builds a WhatsApp wa.me URL with a pre-filled enquiry message
 */
export function buildWhatsAppEnquiryUrl(): string {
  const number = getWhatsAppNumber();
  const message = encodeURIComponent('Hello, I would like to enquire about cab booking.');
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Gets the display-friendly WhatsApp number
 */
export function getWhatsAppDisplayNumber(): string {
  return businessInfo.whatsapp ?? businessInfo.phone;
}
