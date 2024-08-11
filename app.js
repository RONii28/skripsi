require("dotenv").config();
const express       = require("express");
const routes = require("./app/routes"); 
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path")
const fs = require("fs")

// initialize app 
const app = express();


// registering middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(bodyParser.json());

app.get('/api/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'app/upload', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ status: 'error', message: 'File not found' });
    }
    res.sendFile(filePath);
  });
});

// Middleware untuk menyajikan file statis dengan route khusus
app.get('/api/qrcode/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'app/upload/QRIS', filename);

  // Logging untuk mencatat permintaan diterima
  console.log(`Request received for QR code: ${filename}`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Logging untuk mencatat file tidak ditemukan
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ status: 'error', message: 'File not found' });
    }

    // Logging untuk mencatat file ditemukan
    console.log(`File found: ${filePath}`);
    res.sendFile(filePath);
  });
});




  
// registering routes 
app.use(require("./app/routes"));
app.use("/", routes);

// registering error handler
app.use(require("./app/middlewares/errorHandler"));



const PORT = process.env.PORT || 3001;

// running server 
app.listen(process.env.PORT, () => console.log("server running on port 3001"));

// app.post('/api/tokenizer', (req, res) => {
//     const data = req.body;
//     console.log('Data yang diterima:', data);
    
//     // Logika untuk memproses data dan mendapatkan token pembayaran
//     const token = 'contoh_token_pembayaran';
//     res.json({ token: token });
//   });

// Pengaturan Midtrans Snap client
// let snap = new midtransClient.Snap({
//     isProduction: false,
//     serverKey: process.env.SECRET,
//     clientKey: process.env.CLIENT
// })



//     try{
//         const orderId = 'order-id-' + new Date().getTime();
//         console.log(req.body)
//         const parameter= {
//             payment_details: {
//                 siswa_id: req.body.payment_details.siswa_id,
//                 detail_pendaftaran_id: req.body.payment_details.detail_pendaftaran_id,
//                 mapel_id: req.body.payment_details.mapel_id,
//                 harga: req.body.payment_details.harga,
//                 jumlah_pembayaran: req.body.payment_details.jumlah_pembayaran,
//                 tanggal_pembayaran: req.body.payment_details.tanggal_pembayaran
//             },
//             item_details:req.body.item_details.mapel,
//             enabled_payments: ["bank_transfer"],
//             bank_transfer: {
//                 bank: req.body.bank
//             },transaction_details: {
//                 order_id: orderId,
//                 gross_amount: req.body.harga*jumlah_pembayaran.transaction_details.gross_amount
//             }
//         };
//         const transaction = await snap.createTransaction(parameter);
//         res.status(200).json({
//             status: 'success',
//             transaction: transaction
//         });
//     }catch (eror) {
//         res.status(500).json({
//             status: 'error',
//             message: eror.message
//         });
//     }
// });

// app.post('/create-transaction', async (req, res) => {
//     try {
//         if (!req.body.payment_details || !req.body.item_details || !req.body.bank) {
//             throw new Error('Missing required parameters.');
//         }
//         console.log(req.body);

//         const orderId = 'order-id-' + new Date().getTime();
        
//         const itemDetails = req.body.item_details.map(item => ({
//             id: item.mapel_id,
//             price: item.harga,
//             quantity: item.jumlah_pembayaran,
//             name: item.nama_mapel
//         }));

//         // Menghitung gross_amount berdasarkan item_details
//         const grossAmount = itemDetails.reduce((total, item) => {
//             const itemTotal = item.price * item.quantity;
//             if (itemTotal > 99999999999) {
//                 throw new Error('Item total exceeds the maximum allowed amount.');
//             }
//             return total + itemTotal;
//         }, 0);

//         if (grossAmount > 99999999999) {
//             throw new Error('Gross amount exceeds the maximum allowed amount.');
//         }

//         const parameter = {
//             payment_details: {
//                 siswa_id: req.body.payment_details.siswa_id,
//                 detail_pendaftaran_id: req.body.payment_details.detail_pendaftaran_id,
//                 mapel_id: req.body.payment_details.mapel_id,
//                 harga: req.body.payment_details.harga,
//                 jumlah_pembayaran: req.body.payment_details.jumlah_pembayaran,
//                 tanggal_pembayaran: req.body.payment_details.tanggal_pembayaran
//             },
//             item_details: itemDetails,
//             enabled_payments: ["bank_transfer"],
//             bank_transfer: {
//                 bank: req.body.bank
//             },
//             transaction_details: {
//                 order_id: orderId,
//                 gross_amount: grossAmount // Menggunakan gross_amount yang telah dihitung
//             }
//         };

//         const transaction = await snap.createTransaction(parameter);
//         res.status(200).json({
//             status: 'success',
//             transaction: transaction
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

// Endpoint untuk menangani notifikasi dari Midtrans
// app.post('/notification', (req, res) => {
//     snap.transaction.notification(req.body)
//       .then((statusResponse) => {
//         let orderId = statusResponse.order_id;
//         let transactionStatus = statusResponse.transaction_status;
//         let fraudStatus = statusResponse.fraud_status;
  
//         console.log(`Order ID: ${orderId} Transaction Status: ${transactionStatus} Fraud Status: ${fraudStatus}`);
  
//         // Lakukan logika yang diperlukan berdasarkan status transaksi
  
//         res.status(200).send('OK');
//     })
//       .catch((error) => {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     });
// });
  











// const express = require('express');
// const app = express();
// const errorHandler = require('./app/middlewares/errorHandler');

// // Middleware lain, seperti bodyParser, dll.
// app.use(express.json());

// const TelegramBot = require('node-telegram-bot-api');

// // Ganti dengan token API bot Anda
// const token = "7017317943:AAHgYFoNeTTXpM2UB8dSn_Ra0BFvkaM1fNc";

// // Buat instance bot
// const bot = new TelegramBot(token, { polling: true });
 
// // Menangani pesan 'start'
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Selamat datang! Bot ini siap digunakan.');
// });

// // Menangani pesan teks lainnya
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Anda mengirim pesan: ' + msg.text);
// });


// // Rute Anda di sini
// app.post('/update-verification-code', (req, res, next) => {
//     const { email, verificationCode } = req.body;

//     const query = 'UPDATE user SET verificationCode = ? WHERE email = ?';
//     connection.query(query, [verificationCode, email], (error, results) => {
//         if (error) {
//             return next(error); // Kirim kesalahan ke middleware penanganan kesalahan
//         }
//         res.status(200).json({ message: 'Kode verifikasi diperbarui' });
//     });
// });

// // Gunakan middleware penanganan kesalahan di akhir
// app.use(errorHandler);

// // Jalankan server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Server berjalan di port 3001`);
// });