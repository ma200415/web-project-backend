var express = require('express');
var router = express.Router();

const dbMongo = require('../helpers/mongodb')

const signInUser = {
  email: '',
  password: ''
};

router.post('/', async function (req, res, next) {
  try {
    signInUser.email = req.body.email
    signInUser.password = req.body.password

    const result = await dbMongo.query('user', { email: signInUser.email });

    if (result.length > 0) {
      const firstResult = result[0]

      const match = await dbMongo.comparePassword(signInUser.password, firstResult.password);

      res.send({ status: match, message: (match ? `Welcome ${firstResult.firstName} ${firstResult.lastName}!` : 'Password is not correct') });
    } else {
      res.send({ status: false, message: 'User not found' });
    }
  } catch (err) {
    res.send({ status: false, message: err });
  }
});

module.exports = router;
