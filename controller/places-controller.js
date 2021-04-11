const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the World!',
        location: {
            lat: 40.7484405,
            lng: -73.9878531
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the World!',
        location: {
            lat: 40.7484405,
            lng: -73.9878531
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
]

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    })

    if(!place) {
        throw new HttpError('Could not find a place with the provided id', 404)
    }

    res.json({place});
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId
    })

    if(!places || places.length === 0) {
        return next(new HttpError('Could not find places with the provided user id', 404));
    }

    res.json({places});
}

const createPlace = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422)
    }

    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuidv4(),
        title: title,
        description: description,
        location: coordinates,
        address: address,
        creator: creator
    };

    DUMMY_PLACES.push(createdPlace);//unshift(createdPlace) for add to first position

    res.status(201).json({createdPlace});
}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422)
    }

    const { title, description } = req.body;
    let placeId = req.params.pid;

    /*
    Create a new object and copies all key-value pais of the bols object as key-value pairs into the new object
    */
    let updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
}

const deletePlace = (req, res, next) => {
    let placeId = req.params.pid;

    if(!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('Could not find a place for that id.', 404)
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    res.status(200).json({message: 'Deleted place.'});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;