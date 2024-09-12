
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishesController {
  async create(request, response) {
    const { name, description, category, price, ingredients } = request.body;
    const user_id = request.user.id;

    const diskStorage = new DiskStorage();

    // Se a imagem foi enviada, salve-a, senão continue sem imagem
    let filename = null;
    if (request.file) {
      const image = request.file.filename;
      filename = await diskStorage.saveFile(image);
    }

    const ingredientsArray = typeof ingredients === 'string'
      ? ingredients.split(',').map(ingredient => ingredient.replace(/["[\]]/g, '')
        .trim())
      : [];


    const [dish_id] = await knex("dishes").insert({
      name,
      description,
      category,
      price,
      image: filename,
      created_by: user_id,
      updated_by: user_id,
    });

    const ingredientsInsert = ingredientsArray.map((name) => {
      return {
        dish_id,
        name,
        created_by: user_id,
      };
    });

    await knex("ingredients").insert(ingredientsInsert)

    return response.json();
  }

  async show(request, response) {

    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError("Prato não encontrado.");
    }
    const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

    return response.json({
      ...dish,
      ingredients,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).del();

    return response.json();
  }

  async index(request, response) {
    const { title, ingredients } = request.query;

    let dishes;

    if (ingredients) {

      const filteredIngredients = ingredients.split(',').map((ingredients) => ingredients.trim());

      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.description",
          "dishes.category",
          "dishes.price",
          "dishes.image",
        ])
        .whereLike("dishes.name", `%${title}%`)
        .whereIn("ingredients.name", filteredIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
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
        ...dish,
        ingredients: dishIngredients
      }
    })

    return response.json(dishWithIngredients);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, description, category, price, ingredients } = request.body;
    const imageFile = request.file?.filename

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError("Prato não encontrado.", 404);
    }

    const dishUpdate = {
      name: name ?? dish.name,
      description: description ?? dish.description,
      category: category ?? dish.category,
      price: price ?? dish.price,
      updated_by: request.user.id,
      updated_at: knex.fn.now(),
    }

    if (imageFile) {
      const diskStorage = new DiskStorage()

      if (dish.image) {
        await diskStorage.removeFile(dish.image)
      }

      const filename = await diskStorage.saveFile(imageFile)
      dishUpdate.image = filename;
    }

    if (ingredients) {
      await knex("ingredients").where({ dish_id: id }).delete();

      const ingredientsInsert = ingredients.map((name) => {
        return {
          dish_id: id,
          name,
          created_by: dish.created_by,
        };
      })

      await knex("ingredients").insert(ingredientsInsert);
    }

    await knex("dishes").where({ id }).update(dishUpdate);

    return response.json();
  }
}

module.exports = DishesController;
