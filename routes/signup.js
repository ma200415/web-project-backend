var express = require('express');
var router = express.Router();

const dbMongo = require('../helpers/mongodb');

const signUpUser = {
    lastName: '',
    firstName: '',
    email: '',
    password: ''
};

router.post('/', async function (req, res, next) {
    try {
        signUpUser.lastName = req.body.lastName;
        signUpUser.firstName = req.body.firstName;
        signUpUser.email = req.body.email;
        signUpUser.password = req.body.password;

        for (const [key, value] of Object.entries(signUpUser)) {
            if (!value || value.trim() === '') {
                res.send({ success: false, message: `${key.toUpperCase()} is missing` });

                return;
            }
        }

        signUpUser.password = await dbMongo.hash(signUpUser.password);

        const result = await dbMongo.insertOne('user', signUpUser);

        res.send({ success: result.success, message: (result.success ? `Welcome ${signUpUser.firstName} ${signUpUser.lastName}!` : result.message) });
    } catch (err) {
        res.send({ success: false, message: String(err) });
    }
});

module.exports = router;
