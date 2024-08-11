/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("pendaftaran_bayar", t => {
      t.increments("id");
      t.integer("pendaftaran_id").unsigned();
      t.foreign("pendaftaran_id").references("id").inTable("pendaftaran").onDelete("CASCADE");
      t.string("bukti_pembayaran").notNullable();
      t.date("tanggal_pendaftaran").notNullable();
      t.timestamps(true,true);
     })
  };
    
  /**
    * @param { import("knex").Knex } knex
    * @returns { Promise<void> }
    */
  exports.down = function(knex) {
     return knex.schema.dropTable("detail_pendaftaran");
  };