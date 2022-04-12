var express = require('express');
var router = express.Router();

const dbMongo = require('../helpers/mongodb');

const signUpUser = {
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    admin: false
};

const responseFail = {
    errorType: '',
    message: ''
}

router.post('/', async function (req, res, next) {
    try {
        signUpUser.lastName = req.body.lastName;
        signUpUser.firstName = req.body.firstName;
        signUpUser.email = req.body.email;
        signUpUser.password = req.body.password;
        signUpUser.admin = req.body.admin;

        for (const [key, value] of Object.entries(signUpUser)) {
            if (!value || String(value).trim() == '') {
                res.send({ errorType: key, message: `${key.toUpperCase()} is missing` });

                return;
            }
        }

        const findExistsUser = await dbMongo.query('user', { email: signUpUser.email });

        if (findExistsUser.length > 0) {
            responseFail.errorType = 'email'
            responseFail.message = 'Email already exists'
        } else {
            signUpUser.password = await dbMongo.hash(signUpUser.password);

            const result = await dbMongo.insertOne('user', signUpUser);

            res.send({ success: result.success, message: (result.success ? `Welcome ${signUpUser.firstName} ${signUpUser.lastName}!` : result.message) });

            return
        }
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)
    }

    res.send(responseFail);
});

module.exports = router;
