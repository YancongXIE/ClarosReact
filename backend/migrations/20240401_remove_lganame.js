exports.up = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.dropColumn("LGAName");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.string("LGAName", 45);
  });
}; 