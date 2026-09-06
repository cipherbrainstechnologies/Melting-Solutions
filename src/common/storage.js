import { Platform } from 'react-native';

const memoryStore = {};

export async function getItem(key) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return memoryStore[key] ?? null;
}

export async function setItem(key, value) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
    return;
  }
  memoryStore[key] = value;
}

export async function removeItem(key) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
    return;
  }
  delete memoryStore[key];
}

export const storageKeys = {
  buyerOnboarding: 'ms_buyer_onboarding_seen',
  adminOnboarding: 'ms_admin_onboarding_seen',
};
