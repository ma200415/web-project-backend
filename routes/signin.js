var express = require('express');
var router = express.Router();

const dbMongo = require('../helpers/mongodb')
const auth = require('../services/auth')

const signInUser = {
  email: '',
  password: ''
};

const responseFail = {
  errorType: '',
  message: ''
}
const auth = require('../services/auth')

router.post('/', async function (req, res, next) {
  try {
    signInUser.email = req.body.email
    signInUser.password = req.body.password

    for (const [key, value] of Object.entries(signInUser)) {
      if (!value || value.trim() == '') {
        res.send({ errorType: key, message: `${key.toUpperCase()} is empty` });

        return;
      }
    }

    const result = await dbMongo.query('user', { email: signInUser.email });

    if (result.length > 0) {
      const firstMatch = result[0]

      const isMatch = await dbMongo.comparePassword(signInUser.password, firstMatch.password);

      if (isMatch) {
        const userPayload = firstMatch
        delete userPayload['password'];

        const authToken = auth.genAuthToken(userPayload)

        if (authToken) {
          res.send({ success: true, authToken: authToken });

          return;
        } else {
          responseFail.errorType = 'error'
          responseFail.message = 'Get auth token failed'
        }
      } else {
        responseFail.errorType = 'password'
        responseFail.message = 'Password is not correct'
      }
    } else {
      responseFail.errorType = 'email'
      responseFail.message = 'User not found'
    }
  } catch (err) {
    responseFail.errorType = 'error'
    responseFail.message = String(err)
  }

  res.send(responseFail);
});

  const userPayload = auth.getBearerTokenPayload(req)

  if (!userPayload.success) {
    res.status(400).end(JSON.stringify(userPayload));
    return
  } else if (!userPayload.user.payload.admin) {
    res.status(400).end(JSON.stringify({ message: "You do not have permission to access" }));
    return
  }
module.exports = router;
