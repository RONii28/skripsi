/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("user", t => {
      t.string("id", 36).primary();
      t.string("email", 100).unique().notNullable();
      t.string("password").notNullable();
      t.string("verificationCode").notNullable();
      t.string("telegramId").notNullable();
      t.enum("role", ["admin", "mentor", "siswa"]).notNullable;
      t.string("otp", 6);
      t.timestamps(true,true);
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = function(knex) {
   return knex.schema.dropTable("user");
};
  