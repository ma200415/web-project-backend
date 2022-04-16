var express = require('express');
var router = express.Router();

const { ObjectId } = require('mongodb');

const ResponseFail = require('../helpers/responseFailModel')

const dbMongo = require('../helpers/mongodb')

const auth = require('../services/auth')

router.post('/name', async function (req, res, next) {
  try {
    const userPayload = auth.getBearerTokenPayload(req)

    if (!userPayload.success) {
      res.status(400).end(JSON.stringify(userPayload));
      return
    }

    const result = await dbMongo.findOne('user', { _id: ObjectId(req.body.id) });

    res.status(200).end(JSON.stringify(result));

    return
  } catch (error) {
    console.log("/user/name", error)

    const responseFail = new ResponseFail("error", error)

    res.status(200).end(responseFail);

    return
  }
})

module.exports = router;
