const { hash, compare } = require('bcryptjs');

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

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name,email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json({});
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
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

    if (password && !old_password) {
      throw new AppError('Informe a senha antiga.');
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('Senha antiga inválida.');
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME ('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    )

    return response.json();

  }

}

module.exports = UserController;
