var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  const user = { "username": "CWC" }

  res.send(user);
});

module.exports = router;
