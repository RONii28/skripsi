/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("notifikasi", t => {
      t.increments("id");
      t.integer("admin_id").unsigned();
      t.foreign("admin_id").references("id").inTable("admin").onDelete("CASCADE");
      t.string("jenis_notifikasi").notNullable();
      t.string("isi_notifikasi").notNullable();
      t.timestamps(true,true);
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable("notifikasi");
  };
  