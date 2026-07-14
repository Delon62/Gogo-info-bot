# GALAXI Info Bot

Bot Discord "Information Center" untuk server roleplay. Admin membuat satu panel
per server lewat `/setup-info`; pengguna yang berwenang mengklik tombol pada
panel untuk membangun pengumuman (kategori → form data → field tambahan
opsional → timestamp opsional → upload gambar opsional → preview → pilih
channel & mention → terkirim).

Dibangun dengan Node.js (CommonJS), discord.js v14, better-sqlite3, dan dotenv.
Proyek ini berdiri sendiri (bukan bagian dari sistem artifact Replit) sehingga
bisa langsung dipindahkan ke hosting Node.js/Discord-bot manapun.

## Struktur folder

```
bots/galaxi-info-bot/
├── index.js                 # entry point, login bot
├── deploy-commands.js       # daftarkan slash command secara global
├── config.js                # baca & validasi environment variable
├── commands/                # slash command (/setup-info)
├── events/                  # event listener (ready, interactionCreate, messageCreate)
├── buttons/                 # handler tombol
├── menus/                   # handler select menu
├── modals/                  # handler modal form
├── collectors/              # message collector (upload gambar)
├── handlers/                # loader command/component/event + alur builder/preview/kirim
├── database/                # koneksi SQLite + query guild config & session
├── embeds/                  # pembuat embed (panel, help, info)
├── utils/                   # logger, validator, permission, warna, dll.
└── data/                    # file database SQLite (dibuat otomatis, jangan di-commit)
```

## Menjalankan secara lokal / di server sendiri

1. `cd bots/galaxi-info-bot`
2. `npm install`
3. Salin `.env.example` menjadi `.env`, isi `DISCORD_TOKEN` dan `CLIENT_ID`
   dari [Discord Developer Portal](https://discord.com/developers/applications).
4. Di Developer Portal, aktifkan **Message Content Intent** (Bot > Privileged
   Gateway Intents) — dibutuhkan untuk command `!help` dan upload gambar.
5. Undang bot ke server dengan scope `bot applications.commands` dan izin
   minimal: Send Messages, Embed Links, Attach Files, Manage Messages, Read
   Message History.
6. Daftarkan slash command (sekali saja, atau setiap kali command berubah):
   `npm run deploy-commands`
7. Jalankan bot: `npm start`

## Deploy di hosting Node.js untuk Discord bot (mis. Bot-Hosting.net)

Panel seperti Bot-Hosting.net menjalankan `npm install` sendiri di server lalu
menjalankan file utama Node.js Anda, jadi proyek ini sudah kompatibel apa
adanya:

1. Buat server baru di panel dengan tipe **Node.js**.
2. Upload seluruh isi folder `bots/galaxi-info-bot/` (tidak perlu menyertakan
   `node_modules/` — panel akan menginstalnya sendiri; `data/` juga tidak
   perlu diupload, akan dibuat otomatis).
3. Set **Main File** ke `index.js`.
4. Isi environment/startup variable di panel: `DISCORD_TOKEN`, `CLIENT_ID`,
   dan opsional `PREFIX`, `DEFAULT_EMBED_COLOR`, `MAX_IMAGE_SIZE_MB`,
   `DATABASE_PATH`. Anda tidak wajib mengupload file `.env` — variable dari
   panel otomatis terbaca lewat `process.env`.
5. Pastikan **Message Content Intent** sudah diaktifkan di Developer Portal
   (langkah 4 di bagian lokal di atas), jika tidak bot akan gagal membaca
   pesan untuk `!help` dan upload gambar.
6. Jalankan `npm run deploy-commands` sekali dari console panel (atau
   jalankan lokal sekali saat setup) supaya slash command `/setup-info`
   terdaftar secara global.
7. Start server. Jika muncul error terkait modul native SQLite setelah
   pindah OS/arsitektur, hapus folder `node_modules` di panel lalu restart —
   panel akan menginstal ulang binary yang sesuai dengan sistemnya.
8. `package.json` sudah menyertakan `"engines": { "node": ">=20.0.0" }` —
   pilih versi Node.js 20 ke atas di panel (dibutuhkan oleh better-sqlite3).

## Izin default penggunaan panel

Siapa pun dengan izin **Administrator** atau role yang ditandai sebagai
`allowed_role_id` pada `guild_configs` (belum ada command untuk mengaturnya
dari Discord; bisa diisi manual di database bila dibutuhkan) dapat menekan
tombol "Buat Informasi" di panel. `/setup-info` sendiri selalu dibatasi
Administrator lewat permission bawaan Discord.

## Data & sesi

Semua konfigurasi panel per-server dan sesi pembuatan pengumuman yang sedang
berjalan disimpan di SQLite (`data/database.sqlite`, path bisa diubah lewat
`DATABASE_PATH`). Gambar yang diupload disimpan sementara di memori proses
selama sesi berlangsung (maks. 30 menit) dan otomatis dibersihkan setelah
pengumuman terkirim, dibatalkan, atau kedaluwarsa.
