const placesControllers = require('../controller/places-controller')

describe('functions in place controller should works', () => {
    test('should return a place with the param id', () => {
        let promise = new Promise(((resolve, reject) => {
            setTimeout(() => {
                let responseData = fetch('/api/places/p1');
                resolve(responseData)
            }, 1000)
        }))
        let expected = {
            "place": {
                "id": "p1",
                "title": "Empire State Building",
                "description": "One of the most famous sky scrapers in the World!",
                "location": {
                    "lat": 40.7484405,
                    "lng": -73.9878531
                },
                "address": "20 W 34th St, New York, NY 10001",
                "creator": "u1"
            }
        }
        promise.then(responseData => {
            expect(responseData).toEqual(expected)
        });
    })
})