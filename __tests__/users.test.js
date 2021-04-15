const fetch = require('node-fetch')

const API_ENDPOINT_BASE = 'http://localhost:5000';

describe('functions in user controller should works', () => {
    test('should get users', (done) => {
        let promise = new Promise(((resolve, reject) => {
            let options = {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }

            setTimeout(() => {
                let responseData = fetch(`${API_ENDPOINT_BASE}/api/users/`, options);
                resolve(responseData)
            }, 1000)
        }))
        promise.then(responseData => {
            expect(responseData.status).toEqual(200)
            done()
        });
    })
    test('should return success status when create user', (done) => {
        let newUser = {
            "name": "Jessy",
            "email": "jessy@test.com",
            "password": "SECUREDPASSWORD",
        }

        let options = {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body : JSON.stringify(newUser)
        }

        let promise = new Promise(((resolve, reject) => {
            setTimeout(() => {
                let responseData = fetch(`${API_ENDPOINT_BASE}/api/users/signup/`, options);
                resolve(responseData)
            }, 1000)
        }))
        promise.then(responseData => {
            expect(responseData.status).toEqual(201)
            done()
        });
    })
    test('should return success status for login', (done) => {
        let logUser = {
            "email": "bob.odenkirk@gmail.com",
            "password": "PASSWORD"
        }

        let options = {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body : JSON.stringify(logUser)
        }

        let promise = new Promise(((resolve, reject) => {
            setTimeout(() => {
                let responseData = fetch(`${API_ENDPOINT_BASE}/api/users/login`, options);
                resolve(responseData)
            }, 1000)
        }))
        promise.then(responseData => {
            expect(responseData.status).toEqual(200)
            done()
        });
    })
})