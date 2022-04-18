var express = require('express');
var router = express.Router();

const { ObjectId } = require('mongodb');

const ResponseFail = require('../helpers/responseFailModel')
const dbMongo = require('../helpers/mongodb')

const auth = require('../services/auth');

const doc = "user"

router.post('/name', async (req, res, next) => {
  try {
    const result = await dbMongo.findOne(doc, { _id: ObjectId(req.body.id) });

    res.status(200).end(JSON.stringify(result));

    return
  } catch (error) {
    console.log("/user/name", error)

    const responseFail = new ResponseFail("error", error)

    res.status(400).end(responseFail);

    return
  }
})

router.post('/delete', async function (req, res, next) {
  const result = await dbMongo.deleteOne(req.body.doc, req.body.id);

  const result2 = await dbMongo.find(req.body.doc, {});

  res.status(200).end(JSON.stringify({ success: result.success, message: result.message, result: result2 }));
  return
});

router.get('/all', async function (req, res, next) {
  const userPayload = auth.getBearerTokenPayload(req)

  if (!userPayload.success) {
    res.status(400).end(JSON.stringify(userPayload));
    return
  } else if (userPayload.user.payload.role !== "employee") {
    res.status(400).end(JSON.stringify({ message: "You do not have permission to access" }));
    return
  }

  const result = await dbMongo.find(doc, {});

  res.status(200).end(JSON.stringify(result));

  return
})

router.post('/bookmark', async (req, res, next) => {
  let responseFail

  try {
    const userPayload = auth.getBearerTokenPayload(req)

    if (!userPayload.success) {
      res.status(400).end(JSON.stringify(userPayload));
      return
    }

    const result = await dbMongo.addToSet(doc, userPayload.user.payload._id, { bookmarks: req.body.dogId });

    res.status(200).end(JSON.stringify({ success: result.success, message: result.message }));

    return
  } catch (err) {
    console.log("/user/bookmark", err)

    responseFail = new ResponseFail("error", String(err))

    res.status(400).end(responseFail.json());

    return
  }
});

router.post('/unbookmark', async (req, res, next) => {
  let responseFail

  try {
    const userPayload = auth.getBearerTokenPayload(req)

    if (!userPayload.success) {
      res.status(400).end(JSON.stringify(userPayload));
      return
    }

    const result = await dbMongo.pullFromSet(doc, userPayload.user.payload._id, { bookmarks: req.body.dogId });

    res.status(200).end(JSON.stringify({ success: result.success, message: result.message }));

    return
  } catch (err) {
    console.log("/user/unbookmark", err)

    responseFail = new ResponseFail("error", String(err))

    res.status(400).end(responseFail.json());

    return
  }
});

module.exports = router;
