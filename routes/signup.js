var express = require('express');
var router = express.Router();

const dbMongo = require('../helpers/mongodb');

const SignUpUser = require('../helpers/SignUpUserModel')
const ResponseFail = require('../helpers/responseFailModel')

router.post('/', async function (req, res, next) {
    const signUpUser = new SignUpUser()
    let responseFail

    try {
        signUpUser.lastName = req.body.lastName;
        signUpUser.firstName = req.body.firstName;
        signUpUser.email = req.body.email;
        signUpUser.password = req.body.password;
        signUpUser.admin = req.body.admin;

        for (const [key, value] of Object.entries(signUpUser)) {
            if (!value || String(value).trim() == '') {
                responseFail = new ResponseFail(key, `${key.toUpperCase()} is missing`)

                res.status(400).end(responseFail.json());

                return;
            }
        }

        const findExistsUser = await dbMongo.find('user', { email: signUpUser.email });

        if (findExistsUser.length > 0) {
            responseFail = new ResponseFail("email", 'Email already exists')
        } else {
            signUpUser.password = await dbMongo.hash(signUpUser.password);

            const result = await dbMongo.insertOne('user', signUpUser);

            res.status(200).end(JSON.stringify({ success: result.success, message: (result.success ? `Welcome ${signUpUser.firstName} ${signUpUser.lastName}!` : result.message) }));

            return
        }
    } catch (err) {
        responseFail = new ResponseFail("error", String(err))
    }

    res.status(400).end(responseFail.json());

    return
});

module.exports = router;
