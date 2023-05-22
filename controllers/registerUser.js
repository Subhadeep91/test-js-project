const validator = require('../models/validator');

const registerUserController = async(req, res) => {
  const result = await validator.dataOperation(req);
  res.render('message', {msg: result.msg});
}

module.exports = {registerUserController};