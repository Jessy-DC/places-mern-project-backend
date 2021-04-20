const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password'); // -password for exclude password
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({users: users.map(user => user.toObject({getters: true}))});
}

const createUser = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError(
                'Invalid inputs passed, please, check your data',
                422
            )
        );
    }

    const {name, email, password} = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        )
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        )
        return next(error);
    }

    let createdUser = new User({
        name,
        email,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Bob_Odenkirk_by_Gage_Skidmore_2.jpg/1200px-Bob_Odenkirk_by_Gage_Skidmore_2.jpg',
        password,
        places: []
    })

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({user: createdUser.toObject({getters: true})});
}

const logUserIn = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        )
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid credentials, could not log you in',
            401
        );
        return next(error);
    }

    res.status(200).json({message: 'Logged in!'})
}

exports.getUsers = getUsers;
exports.logUserIn = logUserIn;
exports.createUser = createUser;