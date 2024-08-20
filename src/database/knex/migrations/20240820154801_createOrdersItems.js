exports.up = knex => knex.schema.createTable("orders_items", table => {
  table.increments("id");

  table.text("name").notNullable();
  table.integer("quantity").notNullable();

  table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
  table.integer("dish_id").references("id").inTable("dishes");

  table.timestamp("created_at").defaultTo(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("orders_items");
