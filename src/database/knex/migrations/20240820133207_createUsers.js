exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id");
  table.text("name");
  table.text("email");
  table.text("password");

  table
    .enum("role", ["is_admin", "customer"], { useNative: true, enumName: "roles" })
    .notNullable().default("customer");

  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("users");
