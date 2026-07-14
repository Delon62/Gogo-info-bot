const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const { colorChoicesText } = require('../utils/colors');

function buildHelpEmbed() {
  return new EmbedBuilder()
    .setColor(config.defaultEmbedColor)
    .setTitle(`📖 ${config.botName} - Bantuan`)
    .setDescription('Berikut daftar command yang tersedia beserta fungsinya.')
    .addFields(
      {
        name: '/setup-info',
        value: 'Membuat atau memperbarui Panel Info Center di channel ini. **Khusus Administrator.**',
      },
      {
        name: `${config.prefix}help`,
        value: 'Menampilkan pesan bantuan ini.',
      },
      {
        name: 'Cara Penggunaan',
        value:
          '1. Administrator menjalankan `/setup-info` untuk membuat panel di channel yang diinginkan.\n' +
          '2. Klik tombol **➕ Buat Informasi** pada panel.\n' +
          '3. Pilih kategori, isi form data, tambahkan field/timestamp jika perlu.\n' +
          '4. Upload gambar (opsional) atau ketik `skip`.\n' +
          '5. Periksa preview, lalu klik **✅ Kirim**, **✏ Edit**, atau **❌ Batal**.\n' +
          '6. Pilih channel tujuan dan jenis mention, pengumuman akan terkirim otomatis.',
      },
      {
        name: 'Pilihan Warna Embed',
        value: colorChoicesText(),
      },
    )
    .setFooter({ text: `Versi Bot: ${config.botVersion}` })
    .setTimestamp();
}

module.exports = { buildHelpEmbed };
