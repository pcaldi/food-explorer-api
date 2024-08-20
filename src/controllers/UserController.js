const { hash } = require('bcryptjs');

const AppError = require('../utils/AppError');

const sqlConnection = require('../database/sqlite');

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqlConnection()

    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError('E-mail já está em uso.');
    }

    const HASH_SALT = 8;

    const hashedPassword = await hash(password, HASH_SALT);

    await database.run(
      "INSERT INTO users (name,email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json({});
  }

  async update(request, response) {
    const { name, email } = request.body;
    const { id } = request.params;

    const database = await sqlConnection();

    const user = await database.get(
      "SELECT * FROM users WHERE id = (?)",
      [id]
    );

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError('E-mail já está em uso.');
    }

    user.name = name;
    user.email = email;

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      updated_at = DATETIME ('now')
      WHERE id = ?`,
      [user.name, user.email, id]
    )

    return response.json();

  }

}

module.exports = UserController;
