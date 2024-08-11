/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("pendaftaran", t => {
      t.increments("id");
      t.integer("siswa_id").unsigned();
      t.foreign("siswa_id").references("id").inTable("siswa").onDelete("CASCADE");
      t.integer("mapel_id").unsigned();
      t.foreign("mapel_id").references("id").inTable("mapel").onDelete("CASCADE");
      t.string("biaya_pendaftaran", 10).notNullable();
      t.enum("status_bayar",["belum","lunas","pending","ditolak"]).notNullable().defaultTo("belum");
      t.timestamps(true,true);
     })
  };
    
  /**
    * @param { import("knex").Knex } knex
    * @returns { Promise<void> }
    */
  exports.down = function(knex) {
     return knex.schema.dropTable("pendaftaran");
  };
    