var express = require('express');
var router = express.Router();

var userController = require('../controllers/registerUser');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register', userController.registerUserController);

module.exports = router;
