var express = require('express');
var formidable = require('formidable');
var fs = require('fs');

var router = express.Router();

const dbMongo = require('../helpers/mongodb');

const dog = {
    name: '',
    breed: '',
    age: '',
    gender: ''
}

const responseFail = {
    errorType: '',
    message: ''
}

router.post('/add', async function (req, res, next) {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            // var filename = files.filetoupload.filepath;

            // fs.readFile(filename, (err, data) => {
            //     if (files.filetoupload.size > 0 && mimetype == "image/jpeg") {
            //         console.log(new Buffer.from(data).toString('base64'));
            //     } else {
            //         console.log("not jpg");
            //     }
            // })

            dog.name = fields.name
            dog.breed = fields.breed
            dog.age = fields.age
            dog.gender = fields.gender
            // dog.photo = fields.photo

            const result = await dbMongo.insertOne('dog', dog);

            res.send({ success: result.success, message: (result.success ? '' : result.message) });

            return
        });
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)
    }

    res.send(responseFail);
});

router.get('/all', async function (req, res, next) {
    const result = await dbMongo.query('dog', {});

    res.send(result);
})

module.exports = router;