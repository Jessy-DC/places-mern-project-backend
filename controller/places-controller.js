const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

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
    }
]

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId);
    } catch(err) {
        const error = new HttpError(
            'Something went wrong, cound not find a place.', 500
        );
        return next(error)
    }

    if(!place) {
        const error = new HttpError('Could not find a place with the provided id', 404);
        return next(error);
    }

    res.json({place: place.toObject({getters: true})});
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;

    try {
        places = await Place.find({creator: userId})
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, please try again later',
            500
        );
        return next(error)
    }

    if(!places || places.length === 0) {
        return next(new HttpError('Could not find places with the provided user id', 404));
    }

    res.json({places: places.map(place => place.toObject({getters: true}))});
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;

    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/260px-Empire_State_Building_from_the_Top_of_the_Rock.jpg',
        creator
    });

    try {
        await createdPlace.save();
    } catch {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({place: createdPlace});
}

const updatePlace = async (req, res, next) => {
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
    // let updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};
    // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    let place;
    try {
        place = await Place.findById(placeId);
    } catch {
        const error = new HttpError(
            'Something went wrong, could not update place.', 500
        );
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place.', 500
        );
        return next(error)
    }

    res.status(200).json({place: place.toObject({getters: true})});
}

const deletePlace = async (req, res, next) => {
    let placeId = req.params.pid;

    let place;
    
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.', 500
        );
        return next(error);
    }

    try {
        await place.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.', 500
        );
        return next(error);
    }
    
    res.status(200).json({message: 'Deleted place.'});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;