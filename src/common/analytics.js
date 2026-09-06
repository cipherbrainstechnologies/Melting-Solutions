/**
 * Lightweight analytics facade — ready to wire to Firebase Analytics / Segment later.
 */
const listeners = [];

export const AnalyticsEvents = {
  LANDING_VIEW: 'landing_view',
  CTA_REGISTER: 'cta_register',
  CTA_LOGIN: 'cta_login',
  LOGIN_SUCCESS: 'login_success',
  REGISTER_SUCCESS: 'register_success',
  PRODUCT_VIEW: 'product_view',
  ADD_TO_CART: 'add_to_cart',
  QUOTE_REQUEST: 'quote_request',
  ADMIN_USER_CREATED: 'admin_user_created',
  DASHBOARD_REFRESH: 'dashboard_refresh',
  ONBOARDING_COMPLETE: 'onboarding_complete',
};

export function trackEvent(name, properties = {}) {
  const payload = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  if (__DEV__) {
    console.log('[analytics]', name, properties);
  }

  listeners.forEach((fn) => {
    try {
      fn(payload);
    } catch (_) {
      // no-op
    }
  });
}

export function subscribeAnalytics(listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(index, 1);
  };
}
