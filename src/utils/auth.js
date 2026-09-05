/**
 * auth.js — Thin compatibility shim.
 * The real auth logic now lives in src/context/AuthContext.jsx.
 * This file only exports utilities that are still needed by legacy code
 * during the migration period. Do NOT add multi-profile / demo-user logic here.
 */

export { getInitials } from '../context/AuthContext';

/** Returns the active user ID from localStorage, or null */
export function getActiveUserId() {
  return localStorage.getItem('skillpilot_active_v2') || null;
}

/** Triggers a custom event so legacy listeners can react */
export function triggerAuthRefresh() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('skillpilot-auth-changed'));
  }
}
