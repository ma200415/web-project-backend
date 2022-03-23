var express = require('express');
var router = express.Router();

const auth = require('../services/auth')

router.post('/', async function (req, res, next) {
    const bearer = req.headers['authorization']

    if (bearer) {
        const bearerToken = bearer.split(' ')[1]

        const result = auth.verifyAuthToken(bearerToken)

        res.send(result);

        return
    } else {
        res.send({ errorType: "error", message: "Bearer is missing" });
    }
});

module.exports = router; 