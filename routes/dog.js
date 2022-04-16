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
const Dog = require('../helpers/dogModel')
const ResponseFail = require('../helpers/responseFailModel')

const auth = require('../services/auth')

const doc = "dog"

router.post('/', async function (req, res, next) {
    let responseFail

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
        res.status(200).end(JSON.stringify(result));

        return
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)
        console.log("/dog/", err)

        responseFail = new ResponseFail("error", String(err))
    }

    res.send(responseFail);
    res.status(400).end(responseFail.json());

    return
});

router.post('/add', async function (req, res, next) {
    let responseFail

    try {
        const form = new formidable.IncomingForm();
        const userPayload = auth.getBearerTokenPayload(req)

        form.parse(req, async (err, fields, files) => {
            // var filename = files.filetoupload.filepath;
        if (!userPayload.success) {
            res.status(400).end(JSON.stringify(userPayload));
            return
        }

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
                responseFail = new ResponseFail("name", "Required*")

                res.send(responseFail);
                res.status(400).end(responseFail.json());
            } else if (fields.breed == null || String(fields.breed).trim() == "") {
                responseFail.errorType = 'breed'
                responseFail.message = "Required*"
                responseFail = new ResponseFail("breed", "Required*")

                res.send(responseFail);
                res.status(400).end(responseFail.json());
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
        console.log("/dog/add", err)

        res.send(responseFail);
        responseFail = new ResponseFail("error", String(err))

        res.status(400).end(responseFail.json());
    }

    return
});

router.post('/edit', async function (req, res, next) {
    let responseFail

    try {
        const userPayload = auth.getBearerTokenPayload(req)

        if (!userPayload.success) {
            res.status(400).end(JSON.stringify(userPayload));
            return
        }

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (fields.breed == null || String(fields.breed).trim() == "") {
                responseFail.errorType = 'breed'
                responseFail.message = "Required*"
                responseFail = new ResponseFail("breed", "Required*")

                res.status(400).end(responseFail.json());

                res.send(responseFail);
                return
            } else {
                dog.name = fields.name
                dog.breed = fields.breed
                dog.age = fields.age
                dog.gender = fields.gender

                const result = await dbMongo.replaceOne(doc, fields.dogId, dog);

                res.send(result);
            }
        });

        return
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)
        console.log("/dog/edit", err)

        responseFail = new ResponseFail("error", String(err))

        res.send(responseFail);
        res.status(400).end(responseFail.json());
    }

    return
});

router.post('/delete', async function (req, res, next) {
    let responseFail

    try {
        const userPayload = auth.getBearerTokenPayload(req)

        if (!userPayload.success) {
            res.status(400).end(JSON.stringify(userPayload));
            return
        }
        const result = await dbMongo.deleteOne(doc, req.body.id);

        res.send({ success: result.success, message: result.message });

        return
    } catch (err) {
        responseFail.errorType = 'error'
        responseFail.message = String(err)
    }
        console.log("/dog/delete", err)

    res.send(responseFail);
});
        responseFail = new ResponseFail("error", String(err))

router.get('/all', async function (req, res, next) {
    const result = await dbMongo.query(doc, {});
        res.status(400).end(responseFail.json());

    res.send(result);
})
        return
    }
});

module.exports = router;
