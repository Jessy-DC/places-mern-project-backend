const express = require('express')

const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET Request in places');
    res.json({message: 'It works'})
})

module.exports = router;