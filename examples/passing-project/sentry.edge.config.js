// Fixture: warns if the DSN is not on Sentry's EU data region.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? ''
if (dsn && !dsn.includes('.de.sentry.io')) {
  console.warn('[sovereignty] Sentry DSN does not target the EU data region (de.sentry.io)')
}
export default { dsn, sendDefaultPii: false }
