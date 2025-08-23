// Shared Utilities - Common utility functions
export {
  formatPrice,
  formatPriceCompact,
  formatDate,
  formatDateTime,
  formatRelativeTime
} from './formatting';

export {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  validateRequired
} from './validation';

export {
  formatDateShort,
  formatDateLong,
  getDaysDifference,
  addDays,
  startOfDay,
  endOfDay
} from './date';

export {
  capitalize as stringCapitalize,
  capitalizeWords,
  camelCase,
  pascalCase,
  kebabCase,
  slugify as stringSlugify,
  truncate as stringTruncate,
  titleCase as stringTitleCase
} from './string';

export {
  formatNumber,
  formatPercentage,
  clamp,
  randomInt,
  roundTo
} from './number';