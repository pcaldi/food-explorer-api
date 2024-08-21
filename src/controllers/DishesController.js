
const knex = require("../database/knex");

class DishesController {
  async create(request, response) {
    const { name, description, category, price, image, ingredients } = request.body;
    const { user_id } = request.params;

    const [dish_id] = await knex("dishes").insert({
      name,
      description,
      category,
      price,
      image,
      created_by: user_id,
      updated_by: user_id,
    });

    const ingredientsInsert = ingredients.map((name) => {
      return {
        dish_id,
        name,
        created_by: user_id,
      };
    });

    await knex("ingredients").insert(ingredientsInsert);

    response.json();
  }

  async show(request, response) {

    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

    response.json({
      ...dish,
      ingredients,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).del();

    response.json();
  }

  async index(request, response) {
    const { title, ingredients } = request.query;

    let dishes;

    if (ingredients) {

      const filteredIngredients = ingredients.split(',').map((ingredients) => ingredients.trim());

      dishes = await knex("ingredients")
        .select([
          "dishes.name",
          "dishes.description",
          "dishes.category",
          "dishes.price",
          "dishes.image",
        ])
        .whereLike("dishes.name", `%${title}%`)
        .whereIn("ingredients.name", filteredIngredients)
        .innerJoin("dishes", "dishes,id", "ingredients.dish_id")
        .orderBy("dishes.name")

    } else {

      dishes = await knex("dishes")
        .whereLike("name", `%${title}%`)
        .orderBy("name")
    }

    const dishesIngredients = await knex("ingredients");

    const dishWithIngredients = dishes.map((dish) => {
      const dishIngredients = dishesIngredients.filter(ingredients => ingredients.dish_id === dish.id);

      return {
        ...dishes,
        ingredients: dishIngredients
      }
    })

    response.json(dishWithIngredients);

  }
}

module.exports = DishesController;
