const knex = require('../database/knex');
const AppError = require('../utils/AppError');

class FavoritesController {
  async create(request, response) {
    const { dish_id } = request.body;
    const user_id = request.user.id;

    // Verificar se o prato já está nos favoritos
    const favoriteExists = await knex("favorites").where({ dish_id, user_id }).first();

    if (favoriteExists) {
      throw new AppError("Você já favoritou este prato.", 400);
    }

    // Adiciona o favorito
    await knex("favorites").insert({
      dish_id,
      user_id,
    });

    // Retorna os dados do prato favoritado
    const favorite = await knex("dishes")
      .select([
        "dishes.id",
        "dishes.name",
        "dishes.description",
        "dishes.price",
        "dishes.image",
      ])
      .where("dishes.id", dish_id)
      .first();

    return response.json(favorite);
  }

  async index(request, response) {
    const user_id = request.user.id;

    const favorites = await knex("favorites")
      .select("dishes.*")
      .innerJoin("dishes", "dishes.id", "favorites.dish_id")
      .where({ "favorites.user_id": user_id });

    return response.json(favorites);
  }

  async delete(request, response) {
    const { dish_id } = request.params;
    const user_id = request.user.id;

    await knex("favorites")
      .where({ user_id, dish_id })
      .delete();

    return response.json();
  }
}

module.exports = FavoritesController;
