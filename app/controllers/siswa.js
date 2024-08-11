const db     = require("../../databases");

// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");
const { siswa, updateSiswa } = require("../validations/siswa");




module.exports = class SiswaController {
  static async getAllSiswa(req, res, next) {
    try {
      const rows = await db('siswa').select(
        'id',
        'user_id',
        'nama_siswa',
        'alamat_siswa',
        'jk_siswa',
        'tl_siswa',
        'no_hp_siswa',
        'created_at',
        'updated_at'
      );

      if (rows.length > 0) {
        return res.json({ status: 'success', siswa: rows });
      } else {
        return res.status(404).json({ status: 'error', message: 'No data found' });
      }
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { error, value } = kategori.validate(req.body);
  
      if (error) {
        throw new Api422Error("Validation error", error.details);
      }
  
      const { mentor_id, nama_kategori, tingkat } = value;
  
      // Insert data into the kategori table
      await db("kategori").insert({
        mentor_id,
        nama_kategori,
        tingkat,
      });
  
      // Retrieve the newly created kategori data
      const [newKategori] = await db("kategori")
        .where({ mentor_id, nama_kategori, tingkat })
        .orderBy('id', 'desc')
        .select("mentor_id", "nama_kategori", "tingkat");
  
      return res.status(201).json({
        success: true,
        message: "Data kategori successfully created",
        data: newKategori,
      });
    } catch (error) {
      next(error);
    }
  }
  

  // static async create(req, res, next) {
  //   try {
  //     const { error, value } = siswa.validate(req.body);
      
  //     if (error) {
  //       throw new Api422Error("Validation error", error.details);
  //     }
  
  //     const { user_id, nama_siswa, alamat_siswa, jk_siswa, tl_siswa, no_hp_siswa } = value;
  
  //     // Insert data into the siswa table
  //     await db("siswa").insert({
  //       user_id,
  //       nama_siswa,
  //       alamat_siswa,
  //       jk_siswa,
  //       tl_siswa,
  //       no_hp_siswa,
  //     });
  
  //     // Retrieve the newly created siswa data
  //     const [newSiswa] = await db("siswa")
  //       .where({ user_id })
  //       .select("user_id", "nama_siswa", "alamat_siswa", "jk_siswa", "tl_siswa", "no_hp_siswa");
  
  //     return res.status(201).json({
  //       success: true,
  //       message: "Data siswa successfully created",
  //       data: newSiswa,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async getDetail(req, res, next) {
    try {
      const { id } = req.params; // Use req.params to get the parameter from the URL

      const siswa = await db("siswa")
        .select("id", "user_id", "nama_siswa", "alamat_siswa", "jk_siswa", "tl_siswa", "no_hp_siswa", "created_at", "updated_at")
        .where({ id })
        .first();

      if (!siswa) {
        throw new Api404Error(`siswa with id ${id} not found`);
      }

      return res.json({
        success: true,
        message: "Data siswa successfully retrieved",
        siswa,
      });
    } catch (error) {
      next(error);
    }
  }


  static async update(req, res, next) {
    try {
      // Dapatkan id siswa dari params
      const { id } = req.params;
  
      // Query data siswa dari database
      const siswa = await db("siswa").where({ id }).first();
      if (!siswa) {
        throw new Api404Error(`Siswa with id ${id} not found`);
      }
  
      // Dapatkan data dari body request
      const { nama_siswa, alamat_siswa, jk_siswa, tl_siswa, no_hp_siswa } = req.body;
  
      // Lakukan update data ke database
      await db("siswa")
        .where({ id })
        .update({
          nama_siswa,
          alamat_siswa,
          jk_siswa,
          tl_siswa,
          no_hp_siswa,
        });
  
      // Query untuk mendapatkan data siswa yang baru diupdate
      const updatedSiswa = await db("siswa")
        .where({ id })
        .select("user_id", "nama_siswa", "alamat_siswa", "jk_siswa", "tl_siswa", "no_hp_siswa")
        .first();
  
      // Kirim respons JSON dengan data yang sudah diupdate
      return res.json({
        success: true,
        message: "Data siswa successfully updated",
        data: updatedSiswa,
      });
    } catch (error) {
      next(error);
    }
  }
  

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const siswa = await db("siswa").where({ id }).first();

      if (!siswa) {
        throw new Api404Error(`siswa with id ${id} not found`);
      }

      await db("siswa").where({ id }).del();

      return res.json({
        success: true,
        message: "data siswa successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
