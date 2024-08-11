/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("admin", t => {
      t.increments("id");
      t.string("user_id").notNullable();
      t.foreign("user_id").references("id").inTable("user").onDelete("CASCADE");
      t.string("nama_admin", 50).notNullable();
      t.string("alamat_admin",100).notNullable();
      t.date("tl_admin").notNullable();
      t.enum("jk_admin", ["pria", "wanita"]).notNullable;
      t.string("no_hp_admin", 13).notNullable();
      t.timestamps(true,true);
     })
  };
    
  /**
    * @param { import("knex").Knex } knex
    * @returns { Promise<void> }
    */
  exports.down = function(knex) {
     return knex.schema.dropTable("admin");
  };
    