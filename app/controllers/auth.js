require("dotenv").config();
const bcrypt      = require("bcrypt");
const crypto      = require("crypto")
const db = require("../../databases");
const jwt         = require("jsonwebtoken");
const nodemailer  = require("nodemailer");
const express = require("express");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

// Function to clean input data
const cleanInput = (data) => {
  return data.trim().replace(/<[^>]*>?/gm, '');
};

const app = express();
// token bot Telegram 
const bot = new TelegramBot("7017317943:AAHgYFoNeTTXpM2UB8dSn_Ra0BFvkaM1fNc", { polling: true });




// validation
const register    = require("../validations/register");
const login    = require("../validations/login");
const changePassword = require("../validations/change-password");
const verificationEmail = require("../validations/verificationEmail")



// errors
const { Api401Error, Api400Error, Api422Error, Api403Error, Api404Error } = require("../middlewares/errors/ApiErrors");

module.exports = class AuthController {
  
  static cleanInput(data) {
    return data.trim().replace(/<\/?[^>]+(>|$)/g, "");
  }

  static generateUserId() {
    return crypto.randomBytes(16).toString('hex');
  }
  static async registerUser(req, res) {
    const { email, password, telegramId, nama_siswa, alamat_siswa, jk_siswa, tl_siswa, no_hp_siswa } = req.body;

    if (!email || !password || !nama_siswa || !alamat_siswa || !jk_siswa || !tl_siswa || !no_hp_siswa) {
      return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }

    const user_id = AuthController.generateUserId();
    const hashed_password = crypto.createHash('md5').update(password).digest('hex');

    try {
      await db('user').insert({
        id: user_id,
        email,
        password: hashed_password,
        telegramId,
        role: 'siswa',
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      });

      await db('siswa').insert({
        user_id,
        nama_siswa,
        alamat_siswa,
        jk_siswa,
        tl_siswa,
        no_hp_siswa,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      });

      res.json({ status: 'success', message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to register user: ' + error.message });
    }
  }

  
   static async loginAdmin(req, res) {
    const email = req.body.email ? cleanInput(req.body.email) : '';
    const password = req.body.password ? cleanInput(req.body.password) : '';

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }

    // Hash the password using md5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    try {
      const user = await db('user')
        .select('id', 'email', 'verificationCode', 'telegramId', 'role', 'otp', 'created_at', 'updated_at')
        .where({ email, password: hashedPassword })
        .first();

      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      }

      const admin = await db('admin')
        .select('id', 'user_id', 'nama_admin', 'alamat_admin', 'jk_admin', 'tl_admin', 'no_hp_admin', 'created_at', 'updated_at')
        .where({ user_id: user.id })
        .first();

      if (!admin) {
        return res.status(404).json({ status: 'error', message: 'Admin data not found.' });
      }

      // Prepare the response data
      const response = {
        status: 'success',
        user: {
          id: user.id,
          email: user.email,
          verificationCode: user.verificationCode,
          telegramId: user.telegramId,
          role: user.role,
          otp: user.otp,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        admin
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }

  static async loginSiswa(req, res) {
    const email = req.body.email ? cleanInput(req.body.email) : '';
    const password = req.body.password ? cleanInput(req.body.password) : '';

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }

    // Hash the password using md5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    try {
      const user = await db('user')
        .select('id', 'email', 'verificationCode', 'telegramId', 'role', 'otp', 'created_at', 'updated_at')
        .where({ email, password: hashedPassword, role: 'siswa' })
        .first();

      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      }

      const siswa = await db('siswa')
        .select('id', 'user_id', 'nama_siswa', 'alamat_siswa', 'jk_siswa', 'tl_siswa', 'no_hp_siswa', 'created_at', 'updated_at')
        .where({ user_id: user.id })
        .first();

      if (!siswa) {
        return res.status(404).json({ status: 'error', message: 'Siswa data not found.' });
      }

      // Prepare the response data
      const response = {
        status: 'success',
        user: {
          id: user.id,
          email: user.email,
          verificationCode: user.verificationCode,
          telegramId: user.telegramId,
          role: user.role,
          otp: user.otp,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        siswa
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  }
  

// static async verify(req, res, next) {
//   try {
//     const {email, verificationCode} =req.body;
//     // Cek kode verifikasi
//     const user = await db("user")
//     .where({ email })
//     .first()
//     .catch((error) => {
//       throw new Api400Error(error.message);
//     });

//     if (!user) {
//       throw new Api401Error("email anda tidak terdaftar");
//     } else if (user.verificationCode !== verificationCode) {
//       throw new Api401Error("kode verifikasi anda salah");
//     }

//     // Generate token
//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//         name: user.name,
//       },
//       process.env.JWT_SECRET_KEY,
//       {
//         expiresIn: process.env.JWT_TIME_EXPIRED,
//       }
//     );
//     return res.json({
//       success: true,
//       message: "User successfully logged in",
//       token,
//     });
//   } catch (error) {
//     console.log(error); // Log error ke konsol
//     next(error);
//   }
// }

// static async forgotPassword(req, res, next) {
//   try {
//     const otp = require("crypto").randomInt(999999);
//     const { email } = req.body;

//     const user = await db("user").where({ email }).first();
//     if (!user) {
//       throw new Api404Error("email is not registered !!");
//     }

//     await db.transaction(async function (trx) {
//       await db("user").transacting(trx).where({ email }).update({
//         otp,
//       });
//     });

//       // email configuration
//     const transporter = nodemailer.createTransport({
//       host: process.env.SIB_HOST,
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: process.env.SIB_USER, // generated ethereal user
//         pass: process.env.SIB_PASS, // generated ethereal password
//       },
//     });

//     const info = await transporter.sendMail({
//       from: process.env.SIB_USER, // alamat pengirim
//       to: email, // daftar penerima
//       subject: "Forgot Password OTP LKP EXCELLENT PAITON", // subjek
//       text: `Forgot Password | LKP EXCELLENT PAITON | Kode OTP Anda adalah: ${otp}`, // teks biasa
//       html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <table style="width: 100%; max-width: 600px; margin: auto; border-collapse: collapse; border: 1px solid #ddd;">
//           <tr>
//             <td style="background-color: #FFA500; padding: 10px; text-align: center; color: white;">
//               <h1 style="margin: 0;">LKP EXCELLENT PAITON</h1>
//             </td>
//           </tr>
//           <tr>
//             <td style="padding: 20px;">
//               <h2 style="color: #FFA500;">Kode OTP Forgot Password</h2>
//               <p>Halo,</p>
//               <p>Anda telah meminta untuk mereset kata sandi akun LKP EXCELLENT PAITON Anda. Berikut adalah kode OTP Anda:</p>
//               <p style="text-align: center; font-size: 24px; font-weight: bold; color: #FFA500;">${otp}</p>
//               <p>Masukkan kode ini di halaman reset kata sandi untuk melanjutkan proses. Kode ini akan kedaluwarsa dalam waktu 10 menit.</p>
//               <p>Jika Anda tidak meminta reset kata sandi, abaikan email ini.</p>
//               <p>Salam, <br>LKP EXCELLENT PAITON</p>
//             </td>
//           </tr>
//           <tr>
//             <td style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #777;">
//               <p style="margin: 0;">© 2024 Aplikasi LKP EXCELLENT PAITON. Semua hak dilindungi.</p>
//             </td>
//           </tr>
//         </table>
//       </div>`,});
      
//     return res.json({
//       success: true,
//       message: "OTP Code successfully sended",
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// static async verifyOtp(req, res, next) {
//   try {
//       // get otp from params
//     const { otp } = req.params;

//     const data = await db("user").where({ otp }).first();
//     if (!data) {
//       throw new Api404Error("OTP is wrong !!");
//     }

//     return res.json({
//       success: true,
//       message: "OTP successfully verified",
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// static async changePassword(req, res, next) {
//   try {
//       // get otp from params
//     const { otp } = req.params;

//       // check validation and retrive request
//     const { error, value } = changePassword.validate(req.body);
//     if (error) {
//       throw new Api422Error(error.message);
//     }

//     if (value.password != value.confirm_password) {
//       throw new Api400Error(
//         "password is not same with confirm password"
//       );
//     }
//     await db.transaction(async function (trx) {
//       await db("user")
//         .transacting(trx)
//         .where({ otp })
//         .update({
//           otp: null,
//           password: bcrypt.hashSync(value.password, 10),
//         });
//     });
      
//     return res.json({
//       success: true,
//       message: "change password successfully"
//     })
//   } catch (error) {
//     next(error);
//   }
// }
 
static async logout(req, res, next) {
  try {
    const token = req.headers["authorization"];

    if (typeof token === "undefined" || token === "") {
      throw new Api401Error("Invalid token");
    }

      // Add the token to the blacklist
    addToBlacklist(token);

    return res.json({
      success: true,
      message: "User successfully logged out",
    });
  } catch (error) {
    next(error);
  }
}};
