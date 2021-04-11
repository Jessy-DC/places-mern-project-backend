const express = require('express')

const usersController = require('../controller/users-controller')

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup', usersController.createUser);

router.post('/login', usersController.logUserIn)

module.exports = router;