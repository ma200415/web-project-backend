var express = require('express');
var formidable = require('formidable');
var fs = require('fs');

var router = express.Router();

const dbMongo = require('../helpers/mongodb');

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

        if (req.body.birth != null && String(req.body.birth).trim() != '') {
            payload.birth = req.body.birth
        }

        if (req.body.gender != null && String(req.body.gender).trim() != '') {
            payload.gender = req.body.gender
        }

        const result = await dbMongo.find(doc, payload);

        res.status(200).end(JSON.stringify(result));

        return
    } catch (err) {
        console.log("/dog/", err)

        responseFail = new ResponseFail("error", String(err))
    }

    res.status(400).end(responseFail.json());

    return
});

router.post('/add', async function (req, res, next) {
    let responseFail

    try {
        const userPayload = auth.getBearerTokenPayload(req)

        if (!userPayload.success) {
            res.status(400).end(JSON.stringify(userPayload));
            return
        } else if (!userPayload.user.payload.admin) {
            res.status(400).end(JSON.stringify({ message: "You do not have permission to action" }));
            return
        }

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (fields.name == null || String(fields.name).trim() == "") {
                responseFail = new ResponseFail("name", "Required*")

                res.status(400).end(responseFail.json());
            } else if (fields.breed == null || String(fields.breed).trim() == "") {
                responseFail = new ResponseFail("breed", "Required*")

                res.status(400).end(responseFail.json());
            } else {
                const dog = new Dog()

                const uploadPhoto = files.photo;

                if (uploadPhoto.size > 0) {
                    switch (uploadPhoto.mimetype) {
                        case "image/jpeg":
                        case "image/png":
                            const buffer = fs.readFileSync(uploadPhoto.filepath)

                            dog.photo = new Buffer.from(buffer).toString('base64')
                            break;
                        default:
                            responseFail = new ResponseFail("error", "Upload file type is not supported")

                            res.status(400).end(responseFail.json());

                            break;
                    }
                }

                dog.name = fields.name
                dog.breed = fields.breed
                dog.birth = fields.birth
                dog.gender = fields.gender
                dog.addBy = userPayload.user.payload._id
                dog.addTimestamp = new Date()

                const result = await dbMongo.insertOne(doc, dog);

                res.status(200).end(JSON.stringify({ success: result.success, message: result.message }));
            }
        });
    } catch (err) {
        console.log("/dog/add", err)

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
                responseFail = new ResponseFail("breed", "Required*")

                res.status(400).end(responseFail.json());

                return
            } else {
                const dog = new Dog()

                const uploadPhoto = files.photo;

                if (uploadPhoto.size > 0) {
                    switch (uploadPhoto.mimetype) {
                        case "image/jpeg":
                        case "image/png":
                            const buffer = fs.readFileSync(uploadPhoto.filepath)

                            dog.photo = new Buffer.from(buffer).toString('base64')
                            break;
                        default:
                            responseFail = new ResponseFail("error", "Upload file type is not supported")

                            res.status(400).end(responseFail.json());

                            break;
                    }
                } else {
                    dog.photo = fields.photo != null && String(fields.photo).trim() != "" && String(fields.photo) != "null" ? fields.photo : null
                }

                dog.name = fields.name
                dog.breed = fields.breed
                dog.birth = fields.birth
                dog.gender = fields.gender
                dog.editBy = userPayload.user.payload._id
                dog.editTimestamp = new Date()

                const result = await dbMongo.updateOne(doc, fields.dogId, dog);

                res.status(200).end(JSON.stringify(result));
                return
            }
        });

        return
    } catch (err) {
        console.log("/dog/edit", err)

        responseFail = new ResponseFail("error", String(err))

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
        } else if (!userPayload.user.payload.admin) {
            res.status(400).end(JSON.stringify({ message: "You do not have permission to action" }));
            return
        }

        const result = await dbMongo.deleteOne(doc, req.body.dogId);

        res.status(200).end(JSON.stringify({ success: result.success, message: result.message }));

        return
    } catch (err) {
        console.log("/dog/delete", err)

        responseFail = new ResponseFail("error", String(err))

        res.status(400).end(responseFail.json());

        return
    }
});

module.exports = router;
