const db     = require("../../databases");
const express = require('express');
const cron = require("node-cron");
const axios = require("axios");

const app = express();

app.use(express.json());

const TelegramBot = require("node-telegram-bot-api");


// validation
const notifikasi = require("../validations/notifikasi");
// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");

module.exports = class NotifikasiController {

  static async getAll(req, res, next) {
    try {
      const { page = 1, limit = 25, search = "", order = "asc" } = req.query;

      const notifikasi = await db("notifikasi")
        .leftJoin("admin", "admin.id", "notifikasi.admin_id")
        .select("notifikasi.id", "admin.nama_admin", "admin.jk_admin", "notifikasi.jenis_notifikasi", "notifikasi.isi_notifikasi", "notifikasi.created_at", "notifikasi.updated_at")
        .limit(+limit)
        .offset(+limit * (+page - 1))
        .orderBy("notifikasi.created_at", order)
        .where(function () {
          this.where("notifikasi.jenis_notifikasi", "like", `%${search}%`);

          if (req.admin && req.admin.id) {
            this.orWhere("admin.id", req.admin.id);
          }
        });

      return res.json({
        success: true,
        message: "Data notifikasi berhasil diambil",
        notifikasi,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { error, value } = notifikasi.validate(req.body);

      if (error) {
        throw new Api422Error("Validation error", error.details);
      }

      const { admin_id, jenis_notifikasi, isi_notifikasi } = value;

      // Insert data into the database
      await db("notifikasi").insert({
        admin_id,
        jenis_notifikasi,
        isi_notifikasi,
      });

      const telegramBotToken = "7017317943:AAHgYFoNeTTXpM2UB8dSn_Ra0BFvkaM1fNc";
      const chatId = "1021457290";

      const message = `Notifikasi Baru:\n\nID Admin: ${admin_id}\nJenis: ${jenis_notifikasi}\nIsi: ${isi_notifikasi}`;

      await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });

      // Fetch the last inserted notifikasi
      const newNotifikasi = await db("notifikasi")
        .where({ admin_id, jenis_notifikasi, isi_notifikasi })
        .orderBy('created_at', 'desc')
        .first();

      return res.status(201).json({
        success: true,
        message: "Data notifikasi berhasil dibuat",
        data: newNotifikasi // Return the newly created notification data
      });
    } catch (error) {
      next(error);
    }
  }


  static async getDetail(req, res, next) {
    try {
      const { id } = req.params;

      const notifikasi = await db("notifikasi")
        .select("id", "admin_id", "jenis_notifikasi", "isi_notifikasi", "created_at", "updated_at")
        .where({ id })
        .first();

      if (!notifikasi) {
        throw new Api404Error(`Notifikasi dengan id ${id} tidak ditemukan`);
      }

      return res.json({
        success: true,
        message: "Data notifikasi berhasil diambil",
        notifikasi,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;

      const notifikasi = await db("notifikasi").where({ id }).first();
      if (!notifikasi) {
        throw new Api404Error(`Notifikasi dengan id ${id} tidak ditemukan`);
      }

      const { jenis_notifikasi, isi_notifikasi } = req.body;

      await db("notifikasi")
        .update({
          jenis_notifikasi,
          isi_notifikasi,
        })
        .where({ id });

      const updatedNotifikasi = await db("notifikasi").where({ id }).first();

      return res.json({
        success: true,
        message: "Data notifikasi berhasil diperbarui",
        data: updatedNotifikasi,
      });
    } catch (error) {
      next(error);
    }
  }


  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const notifikasi = await db("notifikasi").where({ id }).first();
      if (!notifikasi) {
        throw new Api404Error(`Notifikasi dengan id ${id} tidak ditemukan`);
      }

      await db("notifikasi").where({ id }).del();

      return res.json({
        success: true,
        message: "Data notifikasi berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
};


cron.schedule('0 12 25 * *', async () => {
  try {
    const admin_id = 1;
    const jenis_notifikasi = "Notifikasi Pengingat Pembayaran SPP";
    const isi_notifikasi = "Mohon untuk melakukan pembayaran SPP pada waktu yang telah ditentukan.";

    // Logging sebelum memasukkan data ke dalam database
    console.log("Menyisipkan notifikasi ke dalam database...");

    await db("notifikasi").insert({
      admin_id,
      jenis_notifikasi,
      isi_notifikasi,
    });

    console.log("Notifikasi berhasil disisipkan ke dalam database.");

    const telegramBotToken = "7017317943:AAHgYFoNeTTXpM2UB8dSn_Ra0BFvkaM1fNc";
    const chatId = "1021457290";

    const message = `
📅 *Notifikasi Pengingat Pembayaran SPP* 📅

👨‍💼 *ID Admin*: ${admin_id}
📑 *Jenis*: ${jenis_notifikasi}
📝 *Isi*: ${isi_notifikasi}
`;

    console.log("Mengirim pesan ke Telegram...");

    const response = await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });

    console.log("Respons dari Telegram API:", response.data);

    console.log("Notifikasi bulanan otomatis berhasil dikirim");
  } catch (error) {
    console.error("Error mengirim notifikasi bulanan otomatis", error);
  }
});