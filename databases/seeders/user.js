const bcrypt = require("bcrypt");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user').del()
  await knex('user').insert([
  {
     id: require("crypto").randomUUID(),
     email: "syahrooni2000@gmail.com",
     password: bcrypt.hashSync("syah2811", 10),
     role: "admin",
  }
  ]);
};
