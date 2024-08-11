const db     = require("../../databases");

const { validationResult } = require("express-validator");

// validation
const mentor = require("../validations/mentor");
// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");


module.exports = class MentorController {
  static async getAllMentors(req, res, next) {
    try {
        const query = `
            SELECT 
                id, 
                user_id, 
                nama_mentor, 
                alamat_mentor, 
                jk_mentor, 
                tl_mentor, 
                no_hp_mentor, 
                created_at, 
                updated_at 
            FROM 
                mentor
        `;

        const [results] = await db.raw(query);

        if (results.length > 0) {
            return res.json({ status: 'success', mentors: results });
        } else {
            return res.status(404).json({ status: 'error', message: 'No data found' });
        }
    } catch (error) {
        next(error);
    }
  }



  static async addMentor(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', errors: errors.array() });
        }

        const { user_id, nama_mentor, alamat_mentor, jk_mentor, tl_mentor, no_hp_mentor } = req.body;
        const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const [id] = await db('mentor').insert({
            user_id,
            nama_mentor,
            alamat_mentor,
            jk_mentor,
            tl_mentor,
            no_hp_mentor,
            created_at,
            updated_at
        });

        return res.json({ status: 'success', message: 'Mentor added successfully', id });
    } catch (error) {
        next(error);
    }
  }
  

  static async getMentorByUserId(req, res, next) {
    try {
      const { user_id } = req.query;
  
      if (!user_id) {
        return res.status(400).json({ status: 'error', message: 'user_id parameter is required' });
      }
  
      const query = `
        SELECT 
          id, user_id, nama_mentor, alamat_mentor, jk_mentor, tl_mentor, no_hp_mentor, created_at, updated_at 
        FROM 
          mentor 
        WHERE 
          user_id = ?
      `;
  
      const results = await db.raw(query, [user_id]);
  
      // Extract rows from the results
      const mentors = results[0] || results.rows || [];
  
      if (mentors.length > 0) {
        return res.json({ status: 'success', mentors });
      } else {
        return res.status(404).json({ status: 'error', message: 'No data found' });
      }
    } catch (error) {
      next(error);
    }
  }
  

  static async updateMentor(req, res, next) {
    try {
        console.log('Request body:', req.body); // Tambahkan log ini
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                type: "field",
                msg: err.msg,
                path: err.param,
                location: err.location
            }));
            return res.status(400).json({ status: 'error', errors: formattedErrors });
        }

        const { id, user_id, nama_mentor, alamat_mentor, jk_mentor, tl_mentor, no_hp_mentor } = req.body;

        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const result = await db('mentor')
            .where({ id })
            .update({
                user_id,
                nama_mentor,
                alamat_mentor,
                jk_mentor,
                tl_mentor,
                no_hp_mentor,
                updated_at,
            });

        if (result === 0) {
            return res.status(404).json({ status: 'error', message: 'Mentor not found or no changes made' });
        }

        return res.json({ status: 'success', message: 'Mentor updated successfully' });
    } catch (error) {
        next(error);
    }
}

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const mentor = await db("mentor").where({ id }).first();

      if (!mentor) {
        throw new Api404Error(`mentor with id ${id} not found`);
      }

      await db("mentor").where({ id }).del();

      return res.json({
        success: true,
        message: "data mentor successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
