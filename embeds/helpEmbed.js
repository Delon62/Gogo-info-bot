const { EmbedBuilder } = require('discord.js');
const config            = require('../config');
const { colorChoicesText }    = require('../utils/colors');
const { ALLOWED_IMAGE_LABEL } = require('../utils/validators');

function buildHelpEmbed() {
  return new EmbedBuilder()
    .setColor(config.defaultEmbedColor)
    .setTitle(`📖 ${config.botName} — Bantuan`)
    .setDescription('Berikut daftar command yang tersedia beserta fungsinya.')
    .addFields(
      {
        name:  '/setup-info',
        value: 'Membuat atau memperbarui **Panel Info Center** di channel ini. **Khusus Administrator.**',
      },
      {
        name:  '/set-moderator @role',
        value: `Menetapkan role yang boleh menggunakan \`${config.prefix}clear\`. **Khusus Administrator.**`,
      },
      {
        name:  `${config.prefix}help`,
        value: 'Menampilkan pesan bantuan ini.',
      },
      {
        name:  `${config.prefix}clear <jumlah>`,
        value:
          'Menghapus sejumlah pesan terakhir di channel ini. ' +
          '**Khusus Administrator atau role yang ditetapkan lewat `/set-moderator`.**',
      },
      {
        name:  'Cara Penggunaan',
        value:
          '1. Administrator menjalankan `/setup-info` di channel yang diinginkan.\n' +
          '2. Klik **➕ Buat Informasi** pada panel.\n' +
          '3. Pilih kategori, lalu isi form — judul **wajib**, deskripsi **opsional**.\n' +
          '4. Tambah hingga **5 bagian** (judul + deskripsi opsional) dan atur timestamp.\n' +
          `5. Upload gambar (${ALLOWED_IMAGE_LABEL}, opsional) atau ketik \`skip\`.\n` +
          '6. Periksa preview → **✅ Kirim**, **✏ Edit**, atau **❌ Batal**.\n' +
          '7. Pilih channel tujuan dan jenis mention — pengumuman terkirim otomatis.',
      },
      {
        name:  'Pilihan Warna Embed',
        value: colorChoicesText(),
      },
      {
        name:  'Format Gambar yang Didukung',
        value: ALLOWED_IMAGE_LABEL,
      },
    )
    .setFooter({ text: `Versi Bot: ${config.botVersion}` })
    .setTimestamp();
}

module.exports = { buildHelpEmbed };
