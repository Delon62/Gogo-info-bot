// Format gambar yang diizinkan untuk upload
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const ALLOWED_IMAGE_LABEL = 'PNG, JPG, JPEG, WEBP, atau GIF';

const LIMITS = {
  title: 256,
  description: 4096,
  sectionName: 256,
  sectionValue: 1024,
  footer: 2048,
  maxSections: 5, // Maksimal 5 bagian (section)
};

/**
 * Memeriksa apakah sebuah string adalah URL yang valid (http/https).
 */
function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Memvalidasi field utama embed (title wajib, description opsional).
 */
function validateMainFields({ title, description, footer, thumbnail }) {
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Judul tidak boleh kosong.');
  } else if (title.length > LIMITS.title) {
    errors.push(`Judul maksimal ${LIMITS.title} karakter.`);
  }

  // Deskripsi opsional — hanya validasi panjang jika diisi
  if (description && description.length > LIMITS.description) {
    errors.push(`Deskripsi maksimal ${LIMITS.description} karakter.`);
  }

  if (footer && footer.length > LIMITS.footer) {
    errors.push(`Footer maksimal ${LIMITS.footer} karakter.`);
  }

  if (thumbnail && !isValidUrl(thumbnail)) {
    errors.push('Thumbnail URL tidak valid. Gunakan URL gambar yang valid (http/https).');
  }

  return errors;
}

/**
 * Memvalidasi satu bagian (section) embed — nilai boleh kosong.
 */
function validateSection(name, value) {
  const errors = [];

  if (name.length > LIMITS.sectionName) {
    errors.push(`Judul bagian maksimal ${LIMITS.sectionName} karakter.`);
  }
  if (value && value.length > LIMITS.sectionValue) {
    errors.push(`Isi bagian maksimal ${LIMITS.sectionValue} karakter.`);
  }

  return errors;
}

/**
 * Memvalidasi lampiran gambar yang di-upload pengguna.
 * Mendukung PNG, JPG, JPEG, WEBP, dan GIF.
 */
function validateImageAttachment(attachment, maxSizeMb) {
  const errors = [];
  const contentType = (attachment.contentType || '').toLowerCase();
  const isAllowedType = ALLOWED_IMAGE_TYPES.some((type) => contentType.startsWith(type));

  if (!isAllowedType) {
    errors.push(`Format gambar tidak didukung. Gunakan ${ALLOWED_IMAGE_LABEL}.`);
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (attachment.size > maxBytes) {
    errors.push(`Ukuran gambar maksimal ${maxSizeMb}MB.`);
  }

  return errors;
}

module.exports = {
  LIMITS,
  ALLOWED_IMAGE_LABEL,
  isValidUrl,
  validateMainFields,
  validateSection,
  validateImageAttachment,
};
