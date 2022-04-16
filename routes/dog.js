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

const doc = "dog"

router.post('/', async function (req, res, next) {
    try {
        const payload = {}

        if (req.body.name != null && String(req.body.name).trim() != '') {
            payload.name = req.body.name
        }

        if (req.body.breed != null && String(req.body.breed).trim() != '') {
            payload.breed = req.body.breed
        }

        if (req.body.age != null && String(req.body.age).trim() != '') {
            payload.age = req.body.age
        }

        if (req.body.gender != null && String(req.body.gender).trim() != '') {
            payload.gender = req.body.gender
        }

        const result = await dbMongo.query(doc, payload);

        res.send(result);

        return
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)
    }

    res.send(responseFail);
});

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

            if (fields.name == null || String(fields.name).trim() == "") {
                responseFail.errorType = "name"
                responseFail.message = "Required*"

                res.send(responseFail);
            } else if (fields.breed == null || String(fields.breed).trim() == "") {
                responseFail.errorType = 'breed'
                responseFail.message = "Required*"

                res.send(responseFail);
            } else {
                dog.name = fields.name
                dog.breed = fields.breed
                dog.age = fields.age
                dog.gender = fields.gender
                // dog.photo = fields.photo

                const result = await dbMongo.insertOne(doc, dog);

                res.send({ success: result.success, message: result.message });
            }
        });
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)

        res.send(responseFail);
    }
});

router.post('/edit', async function (req, res, next) {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (fields.breed == null || String(fields.breed).trim() == "") {
                responseFail.errorType = 'breed'
                responseFail.message = "Required*"

                res.send(responseFail);
            } else {
                dog.name = fields.name
                dog.breed = fields.breed
                dog.age = fields.age
                dog.gender = fields.gender

                const result = await dbMongo.replaceOne(doc, fields.dogId, dog);

                res.send(result);
            }
        });
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)

        res.send(responseFail);
    }
});

router.post('/delete', async function (req, res, next) {
    try {
        const result = await dbMongo.deleteOne(doc, req.body.id);

        res.send({ success: result.success, message: result.message });

        return
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)
    }

    res.send(responseFail);
});

router.get('/all', async function (req, res, next) {
    const result = await dbMongo.query(doc, {});

    res.send(result);
})

module.exports = router;
