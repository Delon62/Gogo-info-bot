const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const LIMITS = {
  title: 256,
  description: 4096,
  fieldName: 256,
  fieldValue: 1024,
  footer: 2048,
  maxFields: 25,
};

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateMainFields({ title, description, footer, thumbnail }) {
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Judul tidak boleh kosong.');
  } else if (title.length > LIMITS.title) {
    errors.push(`Judul maksimal ${LIMITS.title} karakter.`);
  }

  if (!description || description.trim().length === 0) {
    errors.push('Deskripsi tidak boleh kosong.');
  } else if (description.length > LIMITS.description) {
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

function validateField(name, value) {
  const errors = [];
  if (name.length > LIMITS.fieldName) {
    errors.push(`Nama field maksimal ${LIMITS.fieldName} karakter.`);
  }
  if (value.length > LIMITS.fieldValue) {
    errors.push(`Isi field maksimal ${LIMITS.fieldValue} karakter.`);
  }
  return errors;
}

function validateImageAttachment(attachment, maxSizeMb) {
  const errors = [];
  const contentType = (attachment.contentType || '').toLowerCase();
  const isAllowedType = ALLOWED_IMAGE_TYPES.some((type) => contentType.startsWith(type));
  if (!isAllowedType) {
    errors.push('Format gambar tidak didukung. Gunakan PNG, JPG, JPEG, atau WEBP.');
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (attachment.size > maxBytes) {
    errors.push(`Ukuran gambar maksimal ${maxSizeMb}MB.`);
  }

  return errors;
}

module.exports = {
  LIMITS,
  isValidUrl,
  validateMainFields,
  validateField,
  validateImageAttachment,
};
