const fetch = require('node-fetch')

const API_ENDPOINT_BASE = 'http://localhost:5000'

describe('functions in place controller should works', () => {
    test('should return a place with the param id', (done) => {
        let promise = new Promise(((resolve, reject) => {
            setTimeout(() => {
                let responseData = fetch(`${API_ENDPOINT_BASE}/api/places/p1`);
                resolve(responseData)
            }, 1000)
        }))
        promise.then(responseData => {
            expect(responseData.status).toEqual(200)
            done()
        });
    })
    test('should return the created place', (done) => {
        let newPlace = {
            "title": "The Eiffel Tower",
            "description": "A beautiful tower !",
            "address": "Champ de Mars, 5 Avenue Anatole France",
            "creator": "u2"
        }

        let options = {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body : JSON.stringify(newPlace)
        }

        let promise = new Promise(((resolve, reject) => {
            setTimeout(() => {
                let responseData = fetch(`${API_ENDPOINT_BASE}/api/places/`, options);
                resolve(responseData)
            }, 1000)
        }))
        promise.then(responseData => {
            expect(responseData.status).toEqual(201)
            done()
        });
    })
})