const fetch = require('node-fetch')

const API_ENDPOINT_BASE = 'http://localhost:5000'

describe('functions in place controller should works', () => {
    test('should found a place', (done) => {
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
    test('should return success status', (done) => {
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
    test('should return success status for update', (done) => {
        let updateData = {
            "title": "The Eiffel Tower",
            "description": "A beautiful tower !"
        }

        let options = {
            method: "PATCH",
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body : JSON.stringify(updateData)
        }

        let promise = new Promise(((resolve, reject) => {
            setTimeout(() => {
                let responseData = fetch(`${API_ENDPOINT_BASE}/api/places/p1`, options);
                resolve(responseData)
            }, 1000)
        }))
        promise.then(responseData => {
            expect(responseData.status).toEqual(200)
            done()
        });
    })
})