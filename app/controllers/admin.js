const db     = require("../../databases");
const admin = require("../validations/admin");
// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");



module.exports = class AdminController {
  static async getAll(req, res, next) {
    try {
      // get data query params for pagination,query params ? params /:id
      const { page = 1, limit = 25, search = "", order = "asc" } = req.query;
      /*
                data users 100
                page 1
                limit 25
                data 1 - 25
                25 x 1 - 25 = 0 => 1 - 25
                page 2
                25 x 2 - 25 = 25 => 26 - 50
                limit itu adalah banyaknya data yang ingin ditampilkan
            */
      const admin = await db("admin")
                .leftJoin("user", "user.id", "admin.user_id") 
                .select("admin.id","user.email","user.role", "admin.nama_admin", "admin.alamat_admin", "admin.jk_admin", "admin.tl_admin", "admin.no_hp_admin", "admin.created_at", "admin.updated_at")
                .limit(+limit)
                .offset(+limit * (+page - 1))
                .orderBy("admin.created_at", order)
                .where(function () {
                  this.where("admin.nama_admin", "like", `%${search}%`);
                  
                  // Check if req.user is defined before using its property
                  if (req.user && req.user.id) {
                    this.orWhere("user.id", req.user.id);
                  }
                });
      return res.json({
        success: true,
        message: "data admin successfully retrived",
        admin,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { error, value } = admin.validate(req.body);
  
      if (error) {
        throw new Api422Error("Validation error", error.details);
      }
  
      const { user_id, nama_admin, alamat_admin, jk_admin, tl_admin, no_hp_admin } = value;
  
      // Insert data into the database
      await db("admin").insert({
        user_id,
        nama_admin,
        alamat_admin,
        jk_admin,
        tl_admin,
        no_hp_admin,
      });
  
      // Retrieve the newly created admin data
      const [newAdmin] = await db("admin")
        .where({ user_id })
        .select("user_id", "nama_admin", "alamat_admin", "jk_admin", "tl_admin", "no_hp_admin");
  
      return res.status(201).json({
        success: true,
        message: "Data admin successfully created",
        data: newAdmin,
      });
    } catch (error) {
      next(error);
    }
  }
  

  static async getDetail(req, res, next) {
    try {
      const { id } = req.params; // Use req.params to get the parameter from the URL

      const admin = await db("admin")
        .select("id", "user_id", "nama_admin", "alamat_admin", "jk_admin", "tl_admin", "no_hp_admin", "created_at", "updated_at")
        .where({ id })
        .first();

      if (!admin) {
        throw new Api404Error(`user with id ${id} not found`);
      }

      return res.json({
        success: true,
        message: "Data admin successfully retrieved",
        admin,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      // get data from params
      const { id } = req.params;

      // querying data from db
      const admin = await db("admin").where({ id }).first();
      if (!admin) {
        throw new Api404Error(`Admin with id ${id} not found`);
      }

      // get data from request body
      const { nama_admin, alamat_admin, jk_admin, tl_admin, no_hp_admin } = req.body;

      // update data in the database
      await db("admin")
        .where({ id })
        .update({
          nama_admin,
          alamat_admin,
          jk_admin,
          tl_admin,
          no_hp_admin,
        });

      // retrieve updated admin data
      const updatedAdmin = await db("admin")
        .where({ id })
        .select("user_id", "nama_admin", "alamat_admin", "jk_admin", "tl_admin", "no_hp_admin")
        .first();

      return res.json({
        success: true,
        message: "Admin data successfully updated",
        data: updatedAdmin,
      });
    } catch (error) {
      next(error);
    }
  }


  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const admin = await db("admin").where({ id }).first();

      if (!admin) {
        throw new Api404Error(`admin with id ${id} not found`);
      }

      await db("admin").where({ id }).del();

      return res.json({
        success: true,
        message: "data admin successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
