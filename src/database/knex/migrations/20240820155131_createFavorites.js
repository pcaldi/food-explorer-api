exports.up = knex => knex.schema.createTable("orders_items", table => {
  table.increments("id");



  table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
  table.integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE");

  table.unique([user_id, dish_id]);

  table.timestamp("created_at").defaultTo(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("orders_items");
