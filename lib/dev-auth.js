function isTruthy(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

export function isDevAuthBypassEnabled() {
  return isTruthy(process.env.DEV_AUTH_BYPASS) || isTruthy(process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS);
}

export function getDevAuthBypassEmail() {
  return process.env.DEV_AUTH_BYPASS_EMAIL?.trim().toLowerCase() || 'demo.brand@ytmatcher.dev';
}

export function getDevAuthBypassRole() {
  const role = process.env.DEV_AUTH_BYPASS_ROLE?.trim().toLowerCase();
  if (role === 'brand' || role === 'creator') {
    return role;
  }
  return null;
}
