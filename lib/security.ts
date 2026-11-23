import sanitize from 'sanitize-html';

/**
 * Escapes characters with special meaning in HTML to prevent HTML injection.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates whether an email string conforms to a standard email format.
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

const TRUSTED_IMAGE_HOSTS = new Set([
  'res.cloudinary.com',
  'images.unsplash.com',
]);

/**
 * Validates that an image URL uses HTTPS and belongs to a trusted host or relative path,
 * rejecting unsafe schemes (javascript:, data:, http:).
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Allow relative URLs starting with a single '/'
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (TRUSTED_IMAGE_HOSTS.has(host) || host.endsWith('.cloudinary.com')) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Sanitizes rich text HTML content to prevent Cross-Site Scripting (XSS),
 * allowing safe formatting tags while stripping scripts, event handlers, and unsafe URLs.
 * Restricts <img> tags to trusted image hosts or relative paths.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  return sanitize(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'b', 'i', 'strong', 'em', 'strike', 's', 'u',
      'code', 'pre', 'hr', 'br',
      'ul', 'ol', 'li',
      'blockquote', 'span', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['https'],
    },
    exclusiveFilter: (frame) => {
      if (frame.tag === 'img') {
        const src = frame.attribs?.src;
        return !isValidImageUrl(src);
      }
      return false;
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce safe rel attributes on links that open in new window or target external sites
        const href = attribs.href || '';
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isExternal || attribs.target === '_blank'
              ? { rel: 'noopener noreferrer' }
              : {}),
          },
        };
      },
    },
  });
}

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

/**
 * Inspects binary magic numbers (file signatures) to verify actual file content.
 */
export function verifyImageMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // GIF: 47 49 46 38 ('GIF8')
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return true;
  }

  // WebP: 'RIFF'....'WEBP'
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return true;
  }

  // AVIF / HEIF: bytes 4-8 are 'ftyp' and contains 'avif', 'avis', or 'mif1'
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buffer.toString('ascii', 8, 12);
    if (['avif', 'avis', 'mif1', 'msf1'].includes(brand)) {
      return true;
    }
  }

  return false;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file size, declared MIME type, and binary magic bytes.
 */
export function validateImageFile(file: File, buffer: Buffer): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (buffer.length === 0 || file.size === 0) {
    return { valid: false, error: 'Empty file provided' };
  }

  if (file.size > MAX_UPLOAD_SIZE || buffer.length > MAX_UPLOAD_SIZE) {
    return { valid: false, error: 'File size exceeds maximum allowed limit of 5 MB' };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type}). Allowed formats: JPEG, PNG, WebP, GIF, AVIF.`,
    };
  }

  if (!verifyImageMagicBytes(buffer)) {
    return {
      valid: false,
      error: 'File content does not match allowed image signatures.',
    };
  }

  return { valid: true };
}
