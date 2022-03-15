var express = require('express');
var router = express.Router();

const dbMongo = require('../helpers/mongodb')

/* GET users listing. */
// router.get('/', async function (req, res, next) {
//   // const user = { "username": "CWC24" }
//   try {
//     let user = await dbMongo.run_query('user', {});

//     res.send(user);
//   } catch (err) {
//     console.log(err)
//   }
// });

router.post('/', async function (req, res, next) {
  try {
    console.log(req.body)
    let user = await dbMongo.run_query('user', {});

    res.send(user);
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
