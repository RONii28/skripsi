const db     = require("../../databases");
const { validationResult } = require('express-validator');
require('dotenv').config(); 
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// validation
const pendaftaran = require("../validations/pendaftaran");
// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");
const { default: axios } = require("axios");



// multer
// const upload = require("../helpers/multer")("user").single("avatar");

module.exports = class PendaftaranController {
  static async getAllPendaftaran(req, res, next) {
    try {
        const query = `
            SELECT 
                pendaftaran.id AS pendaftaran_id, 
                siswa.nama_siswa,
                siswa.no_hp_siswa,
                siswa.alamat_siswa,
                siswa.jk_siswa,
                siswa.tl_siswa,
                mapel.nama_mapel, 
                mapel.tingkat AS mapel_tingkat, 
                kategori.nama_kategori,
                kategori.tingkat AS kategori_tingkat,
                mentor.nama_mentor,
                pendaftaran.tanggal_pendaftaran,
                pendaftaran.status_bayar,
                pendaftaran.biaya_pendaftaran
            FROM 
                pendaftaran
            JOIN 
                mapel ON pendaftaran.mapel_id = mapel.id
            JOIN 
                kategori ON mapel.kategori_id = kategori.id
            JOIN 
                mentor ON kategori.mentor_id = mentor.id
            JOIN 
                siswa ON pendaftaran.siswa_id = siswa.id
        `;

        const result = await db.raw(query);
        const mapels = result[0];

        if (mapels.length > 0) {
            return res.json({ status: 'success', pendaftars: mapels });
        } else {
            return res.status(404).json({ status: 'error', message: 'No data found' });
        }
    } catch (error) {
        next(error);
    }
  }
  
 

  static async getPendaftaranBySiswaId(req, res, next) {
    const { siswa_id } = req.query;

    if (!siswa_id) {
      return res.status(400).json({ status: 'error', message: 'siswa_id parameter is required' });
    }

    try {
      const pendaftaran = await db('pendaftaran')
        .where('siswa_id', siswa_id)
        .select('id', 'siswa_id', 'mapel_id', 'tanggal_pendaftaran', 'biaya_pendaftaran', 'status_bayar');

      if (pendaftaran.length > 0) {
        return res.json({ status: 'success', pendaftaran });
      } else {
        return res.status(404).json({ status: 'error', message: 'No data found' });
      }
    } catch (error) {
      next(error);
    }
  }
  


  static async simpanPendaftaran(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { siswa_id, mapel_id, biaya_pendaftaran } = req.body;
    const tanggal_pendaftaran = new Date().toISOString().slice(0, 10);
    const status_bayar = 'belum';
    const created_at = new Date();
    const updated_at = new Date();

    try {
        // Path gambar QRIS
        const qrisFilename = 'qrcode_pembayaran.png';
        const qrisPath = path.join(__dirname, '../upload/QRIS/', qrisFilename); // Ganti dengan path gambar QRIS yang benar
        const qrisUrl = `${req.protocol}://${req.get('host')}/api/qrcode/${qrisFilename}`;

        if (!fs.existsSync(qrisPath)) {
            return res.status(400).json({ status: 'error', message: 'QRIS file not found' });
        }

        // Query untuk memasukkan data ke dalam tabel pendaftaran
        await db('pendaftaran').insert({
            siswa_id,
            mapel_id,
            tanggal_pendaftaran,
            biaya_pendaftaran,
            status_bayar,
            created_at,
            updated_at
        });

        // Mengambil user_id dari tabel siswa berdasarkan siswa_id
        const siswa = await db('siswa')
            .select('user_id', 'nama_siswa', 'alamat_siswa', 'no_hp_siswa', 'jk_siswa')
            .where('id', siswa_id)
            .first();

        // Mengambil telegramId dari tabel user berdasarkan role admin
        const user = await db('user')
            .select('telegramId')
            .where('role', 'admin')
            .first();

        // Mengambil informasi dari tabel mapel, kategori, dan mentor
        const mapel = await db('mapel')
            .join('kategori', 'mapel.kategori_id', 'kategori.id')
            .join('mentor', 'kategori.mentor_id', 'mentor.id')
            .select('mapel.nama_mapel', 'kategori.nama_kategori', 'mentor.nama_mentor')
            .where('mapel.id', mapel_id)
            .first();

        // Mengirim pesan ke Telegram
        const token = "7017317943:AAHgYFoNeTTXpM2UB8dSn_Ra0BFvkaM1fNc";
        const chat_id = "1021457290";
        const message = `📚 *Pendaftaran Baru* 📚\n\n👤 *Nama Siswa*: ${siswa.nama_siswa}\n🏡 *Alamat*: ${siswa.alamat_siswa}\n📞 *No HP*: ${siswa.no_hp_siswa}\n🚻 *Jenis Kelamin*: ${siswa.jk_siswa}\n\n📘 *Mapel*: ${mapel.nama_mapel}\n📂 *Kategori*: ${mapel.nama_kategori}\n👨‍🏫 *Mentor*: ${mapel.nama_mentor}\n\n💵 *Biaya Pendaftaran*: Rp${parseInt(biaya_pendaftaran).toLocaleString('id-ID')}\n📅 *Tanggal Pendaftaran*: ${tanggal_pendaftaran}`;

        const apiURL = `https://api.telegram.org/bot${token}/sendMessage`;
        await axios.post(apiURL, {
            chat_id: chat_id,
            text: message,
            parse_mode: 'Markdown'
        });

        // Mengirim QRIS ke Telegram
        const form = new FormData();
        form.append('chat_id', chat_id);
        form.append('photo', fs.createReadStream(qrisPath));
        form.append('caption', 'Silakan scan QRIS untuk melakukan pembayaran.');

        const sendPhotoURL = `https://api.telegram.org/bot${token}/sendPhoto`;
        await axios.post(sendPhotoURL, form, {
            headers: form.getHeaders()
        });

        // Menyisipkan notifikasi ke dalam database
        await db('notifikasi').insert({
          admin_id: 1, // Sesuaikan dengan ID admin yang sesuai
          jenis_notifikasi: "Pendaftaran Baru",
          isi_notifikasi: message
        });

        res.json({ status: 'success', message: 'Pendaftaran berhasil disimpan', qris_url: qrisUrl });
    } catch (error) {
        next(error);no_hp_siswa
    }
  }

  static async updateStatusBayar(req, res, next) {
    const { pendaftaran_id, status_bayar } = req.body;

    try {
      // Update status bayar
      await db('pendaftaran')
        .where({ id: pendaftaran_id })
        .update({ status_bayar });

      // Fetch siswa_id and mapel_id
      const [pendaftaran] = await db('pendaftaran')
        .select('siswa_id', 'mapel_id')
        .where({ id: pendaftaran_id });

      if (!pendaftaran) {
        return res.status(404).json({ status: 'error', message: 'Pendaftaran not found' });
      }

      const { siswa_id, mapel_id } = pendaftaran;

      // Fetch siswa details
      const [siswa] = await db('siswa')
        .select('nama_siswa', 'alamat_siswa', 'no_hp_siswa', 'jk_siswa', 'user_id')
        .where({ id: siswa_id });

      // Fetch mapel details
      const [mapel] = await db('mapel')
        .join('kategori', 'mapel.kategori_id', 'kategori.id')
        .join('mentor', 'kategori.mentor_id', 'mentor.id')
        .select('mapel.nama_mapel', 'kategori.nama_kategori', 'mentor.nama_mentor')
        .where('mapel.id', mapel_id);

      // Fetch telegramId
      const [user] = await db('user')
        .select('telegramId')
        .where({ id: siswa.user_id, role: 'siswa' });

      if (!user || !user.telegramId) {
        return res.status(404).json({ status: 'error', message: 'User or Telegram ID not found' });
      }

      // Send Telegram notification
      const message = `📢 *Status Pembayaran Diperbarui* 📢\n\n👤 *Nama Siswa*: ${siswa.nama_siswa}\n🏡 *Alamat*: ${siswa.alamat_siswa}\n📞 *No HP*: ${siswa.no_hp_siswa}\n🚻 *Jenis Kelamin*: ${siswa.jk_siswa}\n\n📘 *Mapel*: ${mapel.nama_mapel}\n📂 *Kategori*: ${mapel.nama_kategori}\n👨‍🏫 *Mentor*: ${mapel.nama_mentor}\n\n💰 *Status Pembayaran*: ${status_bayar}`;

      const apiURL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

      await axios.post(apiURL, {
        chat_id:"1021457290",
        text: message,
        parse_mode: 'Markdown'
      });

      res.json({ status: 'success', message: 'Status pembayaran diperbarui dan notifikasi terkirim' });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle Telegram API specific error
        return res.status(400).json({
          status: 'error',
          message: `Telegram API error: ${error.response.data.description}`
        });
      }
      // Generic error handling
      next(error);
    }
  }


  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const pendaftaran = await db("pendaftaran").where({ id }).first();

      if (!pendaftaran) {
        throw new Api404Error(`pendaftaran with id ${id} not found`);
      }

      await db("pendaftaran").where({ id }).del();

      return res.json({
        success: true,
        message: "data pendaftaran successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
