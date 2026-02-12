/**
 * Returns YYYY-MM-DD string in the user's local timezone.
 * Using 'en-CA' locale which natively formats as YYYY-MM-DD.
 */
export function getLocalDate(date = new Date()) {
  return date.toLocaleDateString('en-CA')
}
