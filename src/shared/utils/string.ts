// String Utilities - String manipulation functions
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
}

export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
    .replace(/\s+/g, '');
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export function sentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

export function truncateWords(str: string, maxWords: number, suffix: string = '...'): string {
  const words = str.split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + suffix;
}

export function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function removeHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return str.replace(/[&<>"'/]/g, char => map[char]);
}

export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/'
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, match => map[match]);
}

export function stripWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

export function isBlank(str: string): boolean {
  return isEmpty(str);
}

export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isNumeric(str: string): boolean {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function extractProtocol(url: string): string {
  try {
    return new URL(url).protocol;
  } catch {
    return '';
  }
}

export function extractPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return '';
  }
}

export function extractQueryParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
}

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateId(prefix: string = '', length: number = 8): string {
  const random = generateRandomString(length);
  return prefix ? `${prefix}_${random}` : random;
}

export function maskString(str: string, visibleChars: number = 4, maskChar: string = '*'): string {
  if (str.length <= visibleChars) return str;
  const visible = str.substring(0, visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars);
  return visible + masked;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) return email;
  const maskedLocal = local.substring(0, 2) + '*'.repeat(local.length - 2);
  return `${maskedLocal}@${domain}`;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    return `+56 9 ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

export function countWords(str: string): number {
  return str.trim().split(/\s+/).length;
}

export function countCharacters(str: string, includeSpaces: boolean = true): number {
  return includeSpaces ? str.length : str.replace(/\s/g, '').length;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
}

export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }
  return hashtags;
}