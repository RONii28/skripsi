/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("siswa", t => {
      t.increments("id");
      t.string("user_id").notNullable();
      t.foreign("user_id").references("id").inTable("user").onDelete("CASCADE");
      t.string("nama_siswa", 50).notNullable();
      t.string("alamat_siswa",100).notNullable();
      t.date("tl_siswa").notNullable();
      t.enum("jk_siswa", ["pria", "wanita"]).notNullable;
      t.string("no_hp_siswa", 13).notNullable();
      t.timestamps(true,true);
    })
  };
    
  /**
    * @param { import("knex").Knex } knex
    * @returns { Promise<void> }
    */
  exports.down = function(knex) {
    return knex.schema.dropTable("siswa");
  };
    