const db     = require("../../databases");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// validation
const user = require("../validations/user");
// errors 
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/errors/ApiErrors");


module.exports = class UsersController {
  static async getAll(req, res, next) {
    try {
      // get data query params for pagination,query params ? params /:id
      const { page = 1, limit = 25, search = "" } = req.query;

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
      const users = await db("user")
        .select("id", "email", "role", "created_at", "updated_at")
        .limit(+limit)
        .offset(+limit * +page - +limit)
        .where("email", "like", `%${search}%`)
        .orderBy("created_at", "asc");

      return res.json({
        success: true,
        message: "data successfully retrived",
        users,
      });
    } catch (error) {
      next(error);
    }
  }

  // static async create(req, res, next) {
  //   try {
  //     // const roleUser = req.user.role;
  //     // return console.log(roleUser);
  //     // if (req.user.role == "pasien") {
  //     //   throw new Api403Error("pasien doesn'n have permission");
  //     // } else {
  //       /// get data from body
  //       const { error, value } = user.validate(req.body);
  //       if (error) {
  //         throw new Api422Error("validation error", error.details);
  //       }

  //       const { email, password, role,} = value;

  //       // insert data to db
  //       await db("user").insert({
  //         id: crypto.randomUUID(),
  //         email,
  //         password: bcrypt.hashSync(password, 10),
  //         role,
  //       });

  //       return res.status(201).json({
  //         success: true,
  //         message: "data user successfully created",
  //       });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // static async getDetail(req, res, next) {
  //   try {
  //     // get data from params
  //     const { id } = req.params;

  //     // querying data to db
  //     const user = await db("user")
  //       .select(
  //         "id",
  //         "email",
  //         "role",
  //         "created_at",
  //         "updated_at"
  //       )
  //       .where({ id })
  //       .first();

  //     // check available user
  //     if (!user) {
  //       throw new Api404Error(`User with id ${id} not found`);
  //     }

  //     return res.json({
  //       success: true,
  //       message: "data successfully  retrived",
  //       user,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // static async getDetail(req, res, next) {
  //   try {
  //       // get data from params
  //       const { id } = req.params;
  //       console.log("Received ID:", id);  // Debugging log

  //       // check if id is provided
  //       if (!id) {
  //           throw new Api404Error("ID is required");
  //       }

  //       // querying data to db
  //       const user = await db("user")
  //           .select("id", "email", "role", "created_at", "updated_at")
  //           .where({ id })
  //           .first();

  //       // check available user
  //       if (!user) {
  //           throw new Api404Error(`User with id ${id} not found`);
  //       }

  //       return res.json({
  //           success: true,
  //           message: "Data successfully retrieved",
  //           user,
  //       });
  //   } catch (error) {
  //       next(error);
  //   }
  // }

  // static async getDetail(req, res, next) {
  //   try {
  //       // get data from params
  //       const { id } = req.params;
  //       console.log("Received ID:", id);  // Debugging log

  //       // check if id is provided
  //       if (!id) {
  //           throw new Api404Error("ID is required");
  //       }

  //       // querying data to db
  //       const user = await db("user")
  //           .select("id", "email", "role", "created_at", "updated_at")
  //           .where({ id })
  //           .first();

  //       // check available user
  //       if (!user) {
  //           throw new Api404Error(`User with id ${id} not found`);
  //       }

  //       return res.json({
  //           success: true,
  //           message: "Data successfully retrieved",
  //           user,
  //       });
  //   } catch (error) {
  //       next(error);
  //   }
  // }

  // static async update(req, res, next) {
  //   try {
  //     // get data from params
  //     const { id } = req.params;

  //     // querying data to db
  //     const user = await db("user").where({ id }).first();
  //     if (!user) {
  //       throw new Api404Error(`User with id ${id} not found`);
  //     }
  //     // get data from body
  //     const { email, password, role } = req.body;

  //     // insert data to db
  //     await db("user")
  //       .update({
  //         id: crypto.randomUUID(),
  //         email,
  //         password: bcrypt.hashSync(password, 10),
  //         role,
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
  //       message: "data user successfully updated",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const user = await db("user").where({ id }).first();

      if (!user) {
        throw new Api404Error(`User with id ${id} not found`);
      }

      await db("user").where({ id }).del();

      return res.json({
        success: true,
        message: "data users successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
};
