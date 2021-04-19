const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Bob Odenkirk',
        email: 'bob.odenkirk@gmail.com',
        password: 'PASSWORD'
    }
]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
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

    const {name, email, password, places} = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError(
            'Signin up failer, please try again later.',
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
        places
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

const logUserIn = (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = DUMMY_USERS.find(u => {
        return u.email === email
    })

    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong.', 401)
    }

    res.status(200).json({message: `${identifiedUser.name} is log in !`})
}

exports.getUsers = getUsers;
exports.logUserIn = logUserIn;
exports.createUser = createUser;