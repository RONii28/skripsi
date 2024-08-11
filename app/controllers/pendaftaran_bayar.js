const db     = require("../../databases");
const pendaftaran_bayar = require("../validations/pendaftaran_bayar");
const { validationResult } = require('express-validator');
const axios = require("axios")
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");

module.exports = class pendaftaran_bayarController {

  static async getByIdPendaftaran(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { pendaftaran_id } = req.query;

    try {
      const rows = await db('pendaftaran_bayar')
        .select('id', 'tanggal', 'bukti_pembayaran')
        .where('pendaftaran_id', pendaftaran_id);

        if (rows.length > 0) {
          // Menambahkan URL untuk bukti pembayaran
          const pendaftaran_bayar = rows.map(row => ({
            ...row,
            bukti_pembayaran_url: `${req.protocol}://${req.get('host')}/api/image/${row.bukti_pembayaran}`
          }));

          res.json({
            status: 'success',
            pendaftaran_bayar: pendaftaran_bayar
          });
        } else {
          res.json({ status: 'error', message: 'No data found' });
        }
    } catch (error) {
      next(error);
    }
  }




  static async simpanPembayaran(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { pendaftaran_id } = req.body;
    const bukti_pembayaran = req.file;

    if (!bukti_pembayaran) {
      return res.status(400).json({ status: 'error', message: 'Bukti pembayaran harus diunggah' });
    }

    const upload_dir = path.join(__dirname, '..', 'upload'); // Gunakan path.join untuk membangun jalur direktori
    const file_name = bukti_pembayaran.filename;
    const filePath = path.join(upload_dir, file_name);

    try {
      await db.transaction(async (trx) => {
        await trx('pendaftaran_bayar').insert({
          pendaftaran_id,
          bukti_pembayaran: file_name,
        });

        await trx('pendaftaran')
          .where('id', pendaftaran_id)
          .update({
            status_bayar: 'pending',
          });

        const pendaftaran = await trx('pendaftaran')
          .select('siswa_id', 'mapel_id')
          .where('id', pendaftaran_id)
          .first();

        const siswa = await trx('siswa')
          .select('nama_siswa', 'alamat_siswa', 'no_hp_siswa', 'jk_siswa')
          .where('id', pendaftaran.siswa_id)
          .first();

        const mapel = await trx('mapel')
          .join('kategori', 'mapel.kategori_id', 'kategori.id')
          .join('mentor', 'kategori.mentor_id', 'mentor.id')
          .select('mapel.nama_mapel', 'kategori.nama_kategori', 'mentor.nama_mentor')
          .where('mapel.id', pendaftaran.mapel_id)
          .first();

        const admin = await trx('user')
          .select('telegramId')
          .where('role', 'admin')
          .first();

        const message = `📚 *Pembayaran Baru* 📚\n\n` +
          `👤 *Nama Siswa*: ${siswa.nama_siswa}\n` +
          `🏡 *Alamat*: ${siswa.alamat_siswa}\n` +
          `📞 *No HP*: ${siswa.no_hp_siswa}\n` +
          `🚻 *Jenis Kelamin*: ${siswa.jk_siswa}\n\n` +
          `📘 *Mapel*: ${mapel.nama_mapel}\n` +
          `📂 *Kategori*: ${mapel.nama_kategori}\n` +
          `👨‍🏫 *Mentor*: ${mapel.nama_mentor}\n\n`;

        const token = process.env.TELEGRAM_BOT_TOKEN;
        const apiURL = `https://api.telegram.org/bot${token}/sendMessage`;

        await axios.post(apiURL, {
          chat_id: "1021457290",
          text: message,
          parse_mode: 'Markdown',
        });

        const photoURL = `https://api.telegram.org/bot${token}/sendPhoto`;

        // Cek apakah file ada sebelum mengirim permintaan
        if (fs.existsSync(filePath)) {
          const formData = new FormData();
          formData.append('chat_id', "1021457290");
          formData.append('photo', fs.createReadStream(filePath));
          formData.append('caption', `Bukti pembayaran untuk pendaftaran ID: ${pendaftaran_id}`);

          await axios.post(photoURL, formData, {
            headers: formData.getHeaders(),
          });

          // Menyisipkan notifikasi ke dalam database
          await trx('notifikasi').insert({
            admin_id: 1, // Sesuaikan dengan ID admin yang sesuai
            jenis_notifikasi: "Pembayaran Baru",
            isi_notifikasi: message
          });

          res.json({
            status: 'success',
            message: 'Pembayaran berhasil disimpan dan status diperbarui',
          });
        } else {
          throw new Error(`File tidak ditemukan: ${filePath}`);
        }
      });
    } catch (error) {
      next(error);
    }
  }


  static async getDetail(req, res, next) {
    try {
      const { id } = req.params; // Use req.params to get the parameter from the URL

      const pendaftaran_bayar = await db("pendaftaran_bayar")
        .select("id", "pendaftaran_id", "bukti_pembayaran", "tanggal", "updated_at")
        .where({ id })
        .first();

      if (!pendaftaran_bayar) {
        throw new Api404Error(`pendaftaran_bayar with id ${id} not found`);
      }

      return res.json({
        success: true,
        message: "Data pendaftaran_bayar successfully retrieved",
        pendaftaran_bayar,
      });
    } catch (error) {
      next(error);
    }
  }

  // static async update(req, res, next) {
  //   try {
  //     // get data from params
  //     const { id } = req.params;

  //     // querying data to db
  //     const pendaftaran_bayar = await db("pendaftaran_bayar").where({ id }).first();
  //     if (!pendaftaran_bayar) {
  //       throw new Api404Error(`pendaftaran_bayar with id ${id} not found`);
  //     }
  //     // get data from body
  //     const {  bukti_pembayaran, tanggal_pendaftaran } = req.body;

  //     // insert data to db
  //     await db("pendaftaran_bayar")
  //       .update({
  //           bukti_pembayaran,
  //           tanggal_pendaftaran,
  //       })
  //       .where({ id })
  //       .catch((error) => {
  //         return res.status(400).json({
  //           status: false,
  //           message: error.message,
  //         });
  //       });

  //     return res.json({
  //       success: true,
  //       message: "data pendaftaran_bayar successfully updated",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // static async delete(req, res, next) {
  //   try {
  //     const { id } = req.params;

  //     const pendaftaran_bayar = await db("pendaftaran_bayar").where({ id }).first();

  //     if (!pendaftaran_bayar) {
  //       throw new Api404Error(`pendaftaran_bayar with id ${id} not found`);
  //     }

  //     await db("pendaftaran_bayar").where({ id }).del();

  //     return res.json({
  //       success: true,
  //       message: "data pendaftaran_bayar successfully deleted",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
};
