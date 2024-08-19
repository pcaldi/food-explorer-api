
const AppError = require('../utils/AppError')

class UserController {
  create(req, res) {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      throw new AppError("Preencha todos os campos", 400);
    }

    res.json({ name, email, password });
  }

}

module.exports = UserController;
