/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("mapel", t => {
      t.increments("id");
      t.integer("kategori_id").unsigned();
      t.foreign("kategori_id").references("id").inTable("kategori").onDelete("CASCADE");
      t.enum("nama_mapel",["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fisika", "Biologi", "Kimia", "Ekonomi", "Geografi", "TOEFL", "Komputer"]).notNullable();
      t.enum("tingkat", ["SD", "SMP", "SMA", "SMPT", "umum"]).notNullable();
      t.timestamps(true,true);
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable("mapel");
  };
  