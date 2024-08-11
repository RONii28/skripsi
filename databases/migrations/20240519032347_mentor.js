/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("mentor", t => {
      t.increments("id");
      t.string("user_id").notNullable();
      t.foreign("user_id").references("id").inTable("user").onDelete("CASCADE");
      t.string("nama_mentor", 50).notNullable();
      t.string("alamat_mentor",100).notNullable();
      t.date("tl_mentor").notNullable();
      t.enum("jk_mentor", ["pria", "wanita"]).notNullable;
      t.string("no_hp_mentor", 13).notNullable();
      t.timestamps(true,true);
    })
  };
    
  /**
    * @param { import("knex").Knex } knex
    * @returns { Promise<void> }
    */
  exports.down = function(knex) {
    return knex.schema.dropTable("mentor");
  };
    