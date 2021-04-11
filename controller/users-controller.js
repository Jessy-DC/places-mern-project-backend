const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error')

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

const createUser = (req, res, next) => {
    const {name, email, password} = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email)

    if(hasUser) {
        throw new HttpError('Could not create user, email already exist.', 422)
    }

    let createdUser = {
        id: uuidv4(),
        name: name,
        email: email,
        password: password
    }

    DUMMY_USERS.push(createdUser);

    res.status(201).json({message: `${createdUser.name} was successfully created !`})
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