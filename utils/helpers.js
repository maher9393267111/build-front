/**
 * Converts a relative path to an absolute URL
 * @param {string} path - The relative path
 * @returns {string} The absolute URL
 */
export function absoluteUrl(path) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://letsbuildsw.co.uk';
  return `${baseUrl}${path}`;
}

/**
 * Truncates text to a specified length and adds an ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length of the text
 * @returns {string} The truncated text with ellipsis if needed
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
} 