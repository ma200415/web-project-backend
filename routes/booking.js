var express = require('express');

var router = express.Router();

const dbMongo = require('../helpers/mongodb');

const ResponseFail = require('../helpers/responseFailModel')

const auth = require('../services/auth');
const Booking = require('../helpers/bookingModel');

const doc = "booking"

router.get('/', async function (req, res) {
    let responseFail

    try {
        const userPayload = auth.getBearerTokenPayload(req)

        if (!userPayload.success) {
            res.status(400).end(JSON.stringify(userPayload));
            return
        }

        const result = await dbMongo.find(doc, { userId: userPayload.user.payload._id });

        res.status(200).end(JSON.stringify(result));

        return
    } catch (err) {
        console.log("/booking/", err)

        responseFail = new ResponseFail("error", String(err))
    }

    res.status(400).end(responseFail.json());

    return
});

router.post('/booked', async function (req, res) {
    let responseFail

    try {
        const result = await dbMongo.find(doc, { dogId: req.body.dogId });

        res.status(200).end(JSON.stringify(result));

        return
    } catch (err) {
        console.log("/booking/booked", err)

        responseFail = new ResponseFail("error", String(err))
    }

    res.status(400).end(responseFail.json());

    return
});

router.post('/new', async function (req, res) {
    let responseFail

    try {
        const userPayload = auth.getBearerTokenPayload(req)

        if (!userPayload.success) {
            res.status(400).end(JSON.stringify(userPayload));
            return
        }

        const booking = new Booking(req.body)

        for (const [key, value] of Object.entries(booking)) {
            if (key != "remark" && (!value || String(value).trim() == '')) {
                responseFail = new ResponseFail(key, `${key.toUpperCase()} is empty`)

                res.status(400).end(responseFail.json());

                return;
            }
        }

        const result = await dbMongo.insertOne(doc, booking);

        res.status(200).end(JSON.stringify({ success: result.success, message: result.message }));
        return
    } catch (err) {
        console.log("/booking/new", err)

        responseFail = new ResponseFail("error", String(err))

        res.status(400).end(responseFail.json());
        return
    }
});

// router.post('/edit', async function (req, res, next) {
//     let responseFail

//     try {
//         const userPayload = auth.getBearerTokenPayload(req)

//         if (!userPayload.success) {
//             res.status(400).end(JSON.stringify(userPayload));
//             return
//         }

//         const form = new formidable.IncomingForm();

//         form.parse(req, async (err, fields, files) => {
//             if (fields.breed == null || String(fields.breed).trim() == "") {
//                 responseFail = new ResponseFail("breed", "Required*")

//                 res.status(400).end(responseFail.json());

//                 return
//             } else {
//                 const dog = new Dog()

//                 const uploadPhoto = files.photo;

//                 if (uploadPhoto.size > 0) {
//                     switch (uploadPhoto.mimetype) {
//                         case "image/jpeg":
//                         case "image/png":
//                             const buffer = fs.readFileSync(uploadPhoto.filepath)

//                             dog.photo = new Buffer.from(buffer).toString('base64')
//                             break;
//                         default:
//                             responseFail = new ResponseFail("error", "Upload file type is not supported")

//                             res.status(400).end(responseFail.json());

//                             break;
//                     }
//                 } else {
//                     dog.photo = fields.photo != null && String(fields.photo).trim() != "" && String(fields.photo) != "null" ? fields.photo : null
//                 }

//                 dog.name = fields.name
//                 dog.breed = fields.breed
//                 dog.birth = fields.birth
//                 dog.gender = fields.gender
//                 dog.editBy = userPayload.user.payload._id
//                 dog.editTimestamp = new Date()

//                 const result = await dbMongo.updateOne(doc, fields.dogId, dog);

//                 res.status(200).end(JSON.stringify(result));
//                 return
//             }
//         });

//         return
//     } catch (err) {
//         console.log("/dog/edit", err)

//         responseFail = new ResponseFail("error", String(err))

//         res.status(400).end(responseFail.json());
//     }

//     return
// });

// router.post('/delete', async function (req, res, next) {
//     let responseFail

//     try {
//         const userPayload = auth.getBearerTokenPayload(req)

//         if (!userPayload.success) {
//             res.status(400).end(JSON.stringify(userPayload));
//             return
//         }

//         const result = await dbMongo.deleteOne(doc, req.body.id);

//         res.status(200).end(JSON.stringify({ success: result.success, message: result.message }));

//         return
//     } catch (err) {
//         console.log("/dog/delete", err)

//         responseFail = new ResponseFail("error", String(err))

//         res.status(400).end(responseFail.json());

//         return
//     }
// });

router.get('/all', async function (req, res) {
    const result = await dbMongo.find(doc, {});

    res.status(200).end(JSON.stringify(result));

    return
})

module.exports = router;
