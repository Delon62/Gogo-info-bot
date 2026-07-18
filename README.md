# GALAXI Info Bot v2.0.0

Bot Discord untuk membuat pengumuman / informasi ke channel mana pun dengan tampilan embed yang rapi.

## Fitur

- ✅ Embed dengan **judul wajib** dan **deskripsi opsional**
- ✅ Hingga **5 bagian konten** (judul + deskripsi opsional tiap bagian)
- ✅ Upload gambar: **PNG, JPG, JPEG, WEBP, GIF** (maks. 8 MB)
- ✅ Pilihan warna embed (nama, hex, atau random)
- ✅ Timestamp opsional
- ✅ Thumbnail URL opsional
- ✅ Mention: @everyone, @here, atau role tertentu
- ✅ Command `!clear` dengan pembatasan role moderator
- ✅ Panel Info Center yang bisa diperbarui

## Cara Menggunakan

### 1. Persiapan

```bash
cp .env.example .env
# Edit .env dan isi DISCORD_TOKEN dan CLIENT_ID
```

### 2. Install dependensi

```bash
npm install
```

### 3. Jalankan bot

```bash
npm start
```

> Slash command terdaftar otomatis saat bot pertama kali menyala.

## Alur Pembuatan Informasi

1. Administrator menjalankan `/setup-info` di channel yang diinginkan.
2. Klik **➕ Buat Informasi** pada panel.
3. Pilih kategori → isi form utama (judul wajib, deskripsi opsional).
4. Tambah hingga **5 bagian** (Tambah Bagian) dan atur timestamp.
5. Upload gambar (PNG/JPG/JPEG/WEBP/GIF) atau ketik `skip`.
6. Periksa preview → **Kirim**, **Edit**, atau **Batal**.
7. Pilih channel tujuan dan jenis mention.

## Command

| Command | Akses | Deskripsi |
|---|---|---|
| `/setup-info` | Administrator | Buat/perbarui Panel Info Center |
| `/set-moderator @role` | Administrator | Tetapkan role moderator |
| `!help` | Semua | Tampilkan bantuan |
| `!clear <jumlah>` | Admin / Moderator | Hapus pesan |

## Variabel Lingkungan

| Variabel | Wajib | Default | Keterangan |
|---|---|---|---|
| `DISCORD_TOKEN` | ✅ | — | Token bot Discord |
| `CLIENT_ID` | ✅ | — | Client ID aplikasi |
| `PREFIX` | ❌ | `!` | Prefix command pesan |
| `DEFAULT_EMBED_COLOR` | ❌ | `#5865F2` | Warna embed default |
| `MAX_IMAGE_SIZE_MB` | ❌ | `8` | Ukuran maks. gambar |
| `DATABASE_PATH` | ❌ | `./data/database.sqlite` | Path database |
