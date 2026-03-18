/**
 * Joins class names, filtering out falsy values.
 * Usage: classNames('btn', isActive && 'active', highlighted && 'highlight')
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
