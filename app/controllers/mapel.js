const db     = require("../../databases");
// validation
const mapel = require("../validations/mapel");
// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");


module.exports = class MapelController {

  static async getAllMapel(req, res, next) {
    try {
      const query = `
        SELECT 
          mapel.id AS mapel_id, 
          mapel.kategori_id, 
          mapel.nama_mapel, 
          mapel.tingkat AS mapel_tingkat, 
          mapel.created_at AS mapel_created_at, 
          mapel.updated_at AS mapel_updated_at,
          kategori.nama_kategori,
          kategori.tingkat AS kategori_tingkat,
          mentor.nama_mentor
        FROM 
          mapel
        JOIN 
          kategori ON mapel.kategori_id = kategori.id
        JOIN 
          mentor ON kategori.mentor_id = mentor.id
      `;

      const mapels = await db.raw(query);

      if (mapels[0].length === 0) {
        return res.status(404).json({ status: 'error', message: 'No data found' });
      }

      return res.json({ status: 'success', mapels: mapels[0] });
    } catch (error) {
      next(error);
    }
  }

  static async addMapel(req, res, next) {
    try {
      const { kategori_id, nama_mapel, mapel_tingkat } = req.body;

      if (!kategori_id || !nama_mapel || !mapel_tingkat) {
        return res.status(400).json({ status: 'error', message: 'All parameters are required' });
      }

      const created_at = new Date();
      const updated_at = new Date();

      const query = `
        INSERT INTO mapel (kategori_id, nama_mapel, tingkat, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?)
      `;

      await db.raw(query, [kategori_id, nama_mapel, mapel_tingkat, created_at, updated_at]);

      return res.json({ status: 'success', message: 'Mapel added successfully' });
    } catch (error) {
      next(error);
    }
  }


static async getMapelsByKategori(req, res, next) {
  try {
    const { kategori_id } = req.query;
    if (!kategori_id) {
      return res.status(400).json({ status: 'error', message: 'kategori_id parameter is required' });
    }

    const query = `
      SELECT 
        mapel.id AS mapel_id, 
        mapel.kategori_id, 
        mapel.nama_mapel, 
        mapel.tingkat AS mapel_tingkat, 
        mapel.created_at AS mapel_created_at, 
        mapel.updated_at AS mapel_updated_at,
        kategori.nama_kategori,
        kategori.tingkat AS kategori_tingkat,
        mentor.nama_mentor
      FROM 
        mapel
      JOIN 
        kategori ON mapel.kategori_id = kategori.id
      JOIN 
        mentor ON kategori.mentor_id = mentor.id
      WHERE 
        mapel.kategori_id = ?
    `;

    const mapels = await db.raw(query, [kategori_id]);

    if (mapels[0].length === 0) {
      return res.status(404).json({ status: 'error', message: 'No data found' });
    }

    return res.json({ status: 'success', mapels: mapels[0] });
  } catch (error) {
    next(error);
  }
}

static async updateMapel(req, res, next) {
  try {
    const { mapel_id, kategori_id, nama_mapel, mapel_tingkat } = req.body;
    
    if (!mapel_id || !kategori_id || !nama_mapel || !mapel_tingkat) {
      return res.status(400).json({ status: 'error', message: 'All parameters are required' });
    }

    const updated_at = new Date();

    const query = `
      UPDATE mapel 
      SET kategori_id = ?, nama_mapel = ?, tingkat = ?, updated_at = ? 
      WHERE id = ?
    `;
    
    const result = await db.raw(query, [kategori_id, nama_mapel, mapel_tingkat, updated_at, mapel_id]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Mapel not found or no changes made' });
    }

    return res.json({ status: 'success', message: 'Mapel updated successfully' });
  } catch (error) {
    next(error);
  }
}

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const mapel = await db("mapel").where({ id }).first();

      if (!mapel) {
        throw new Api404Error(`mapel with id ${id} not found`);
      }

      await db("mapel").where({ id }).del();

      return res.json({
        success: true,
        message: "data mapel successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
