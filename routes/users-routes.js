const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controller/users-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup',
    fileUpload.single('image'),
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail()
            .isEmail().withMessage('Email must be valid'),
        check('password')
            .isLength({min: 7})
    ], usersController.signup);

router.post('/login', usersController.logUserIn)

module.exports = router;