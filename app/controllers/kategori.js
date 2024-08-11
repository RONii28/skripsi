const db     = require("../../databases");

// validation
const kategori = require("../validations/kategori");
const mentor = require("../validations/mentor")
// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");


module.exports = class KategoriController {
  static async getAllKategori(req, res, next) {
    try {
      const rows = await db('kategori')
        .leftJoin('mentor', 'kategori.mentor_id', 'mentor.id')
        .select(
          'kategori.id',
          'kategori.mentor_id',
          'kategori.nama_kategori',
          'kategori.tingkat',
          'kategori.created_at',
          'kategori.updated_at',
          'mentor.nama_mentor'
        );

      if (rows.length > 0) {
        return res.json({ status: 'success', kategori: rows });
      } else {
        return res.status(404).json({ status: 'error', message: 'No data found' });
      }
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { mentor_id, nama_kategori, tingkat } = req.body;

      if (!mentor_id || !nama_kategori || !tingkat) {
        return res.status(400).json({ status: 'error', message: 'All parameters are required' });
      }

      const created_at = new Date();
      const updated_at = new Date();

      await db('kategori').insert({
        mentor_id,
        nama_kategori,
        tingkat,
        created_at,
        updated_at
      });

      return res.json({ status: 'success', message: 'Category added successfully' });
    } catch (error) {
      next(error);
    }
  }
  


  static async getDataBymentorId(req, res, next) {
    try {
      const { mentor_id } = req.query;
      if (!mentor_id) {
        return res.status(400).json({ status: 'error', message: 'mentor_id parameter is required' });
      }

      const kategoriData = await db('kategori as k')
        .leftJoin('mentor as m', 'k.mentor_id', 'm.id')
        .select(
          'k.id',
          'k.nama_kategori',
          'k.tingkat',
          'k.created_at',
          'k.updated_at',
          'k.mentor_id',
          'm.nama_mentor as mentor'
        )
        .where('k.mentor_id', mentor_id);

      if (kategoriData.length === 0) {
        return res.status(404).json({ status: 'error', message: 'No data found' });
      }

      return res.json({ status: 'success', kategori: kategoriData });
    } catch (error) {
      next(error);
    }
  }
 

  static async updateKategori(req, res, next) {
    const { id, mentor_id, nama_kategori, tingkat } = req.body;

    if (!id || !mentor_id || !nama_kategori || !tingkat) {
      return res.status(400).json({ status: 'error', message: 'All parameters are required' });
    }

    try {
      const updated_at = new Date();

      const affectedRows = await db('kategori')
        .where({ id })
        .update({
          mentor_id,
          nama_kategori,
          tingkat,
          updated_at,
        });

      if (affectedRows > 0) {
        return res.json({ status: 'success', message: 'Category updated successfully' });
      } else {
        return res.status(404).json({ status: 'error', message: 'Category not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const kategori = await db("kategori").where({ id }).first();

      if (!kategori) {
        throw new Api404Error(`kategori with id ${id} not found`);
      }

      await db("kategori").where({ id }).del();

      return res.json({
        success: true,
        message: "data kategori successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
