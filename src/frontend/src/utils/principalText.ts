import { Principal } from '@icp-sdk/core/principal';

export function validatePrincipalText(text: string): { valid: boolean; error?: string; principal?: Principal } {
  if (!text || text.trim() === '') {
    return { valid: false, error: 'Driver Principal is required' };
  }

  try {
    const principal = Principal.fromText(text.trim());
    return { valid: true, principal };
  } catch (error) {
    return { valid: false, error: 'Invalid Principal format. Please enter a valid Principal ID.' };
  }
}
