var express = require('express');
var router = express.Router();

const dbMongo = require('../helpers/mongodb')

const signInUser = {
  email: '',
  password: ''
};

const responseSuccess = {
  success: true,
  message: ''
}

const responseFail = {
  errorType: '',
  message: ''
}

router.post('/', async function (req, res, next) {
  try {
    signInUser.email = req.body.email
    signInUser.password = req.body.password

    const result = await dbMongo.query('user', { email: signInUser.email });

    if (result.length > 0) {
      const firstResult = result[0]

      const match = await dbMongo.comparePassword(signInUser.password, firstResult.password);

      if (match) {
        responseSuccess.message = `Welcome ${firstResult.firstName} ${firstResult.lastName}!`

        res.send(responseSuccess);

        return;
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

module.exports = router;
