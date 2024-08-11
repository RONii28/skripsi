/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("kategori", t => {
      t.increments("id");
      t.integer("mentor_id").unsigned();
      t.foreign("mentor_id").references("id").inTable("mentor").onDelete("CASCADE");
      t.enum("nama_kategori",["kursus", "bimbel"]).notNullable();
      t.enum("tingkat", ["SD", "SMP", "SMA", "SMPT", "umum"]).notNullable();
      t.timestamps(true,true);
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable("kategori");
  };
  