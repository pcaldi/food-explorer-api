const knex = require('../database/knex');

class FavoritesController {
  async create(request, response) {
    const { dish_id } = request.body;
    const user_id = request.user.id;

    const favorite = await knex("favorites").insert({
      dish_id,
      user_id,
    })

    return response.json(favorite);
  }

  async index(request, response) {
    const user_id = request.user.id;

    const favorites = await knex("favorites")
      .select([
        "dishes.*",
        "favorites.dish_id",
      ])
      .innerJoin("dishes", "dishes.id", "favorites.dish_id")
      .where({ user_id });

    return response.json(favorites);

  }

  async delete(request, response) {
    const { id } = request.params

    await knex("favorites").where({ id }).delete();

    return response.json();

  }


}

module.exports = FavoritesController;
