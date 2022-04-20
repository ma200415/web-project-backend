var express = require('express');
const { ObjectId } = require('mongodb');

var router = express.Router();

const dbMongo = require('../helpers/mongodb');

const ResponseFail = require('../helpers/responseFailModel')

const auth = require('../services/auth')

const doc = "message"

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
        console.log(`${doc}/`, err)

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
        }

        const message = req.body
        message.createTimestamp = new Date()

        const result = await dbMongo.insertOne(doc, message);

        res.status(200).end(JSON.stringify(result));

        return
    } catch (err) {
        console.log(`${doc}/add`, err)

        responseFail = new ResponseFail("error", String(err))
    }

    res.status(400).end(responseFail.json());

    return
});

// router.post('/add', async function (req, res, next) {
//     let responseFail

//     try {
//         const userPayload = auth.getBearerTokenPayload(req)

//         if (!userPayload.success) {
//             res.status(400).end(JSON.stringify(userPayload));
//             return
//         } else if (userPayload.user.payload.role !== "employee") {
//             res.status(400).end(JSON.stringify({ message: "You do not have permission to action" }));
//             return
//         }

//         const form = new formidable.IncomingForm();

//         form.parse(req, async (err, fields, files) => {
//             if (fields.name == null || String(fields.name).trim() == "") {
//                 responseFail = new ResponseFail("name", "Required*")

//                 res.status(400).end(responseFail.json());
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
//                 }

//                 dog.name = fields.name
//                 dog.breed = fields.breed
//                 dog.birthday = fields.birthday
//                 dog.gender = fields.gender
//                 dog.location = fields.location
//                 dog.addBy = userPayload.user.payload._id
//                 dog.addTimestamp = new Date()

//                 const result = await dbMongo.insertOne(doc, dog);

//                 res.status(200).end(JSON.stringify({ success: result.success, message: result.message }));
//             }
//         });
//     } catch (err) {
//         console.log("/dog/add", err)

//         responseFail = new ResponseFail("error", String(err))

//         res.status(400).end(responseFail.json());
//     }

//     return
// });

// router.post('/edit', async function (req, res, next) {
//     let responseFail

//     try {
//         const userPayload = auth.getBearerTokenPayload(req)

//         if (!userPayload.success) {
//             res.status(400).end(JSON.stringify(userPayload));
//             return
//         } else if (userPayload.user.payload.role !== "employee") {
//             res.status(400).end(JSON.stringify({ message: "You do not have permission to action" }));
//             return
//         }

//         const form = new formidable.IncomingForm();

//         form.parse(req, async (err, fields, files) => {
//             const dog = new Dog()

//             const uploadPhoto = files.photo;

//             if (uploadPhoto.size > 0) {
//                 switch (uploadPhoto.mimetype) {
//                     case "image/jpeg":
//                     case "image/png":
//                         const buffer = fs.readFileSync(uploadPhoto.filepath)

//                         dog.photo = new Buffer.from(buffer).toString('base64')
//                         break;
//                     default:
//                         responseFail = new ResponseFail("error", "Upload file type is not supported")

//                         res.status(400).end(responseFail.json());

//                         break;
//                 }
//             } else {
//                 dog.photo = fields.photo != null && String(fields.photo).trim() != "" && String(fields.photo) != "null" ? fields.photo : null
//             }

//             dog.name = fields.name
//             dog.breed = fields.breed
//             dog.birthday = fields.birthday
//             dog.gender = fields.gender
//             dog.location = fields.location
//             dog.editBy = userPayload.user.payload._id
//             dog.editTimestamp = new Date()

//             const result = await dbMongo.updateOne(doc, fields.dogId, dog);

//             res.status(200).end(JSON.stringify(result));
//             return
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
//         } else if (userPayload.user.payload.role !== "employee") {
//             res.status(400).end(JSON.stringify({ message: "You do not have permission to action" }));
//             return
//         }

//         const result = await dbMongo.deleteOne(doc, req.body.dogId);

//         res.status(200).end(JSON.stringify({ success: result.success, message: result.message }));

//         return
//     } catch (err) {
//         console.log("/dog/delete", err)

//         responseFail = new ResponseFail("error", String(err))

//         res.status(400).end(responseFail.json());

//         return
//     }
// });

router.get('/all', async function (req, res, next) {
    try {
        const result = await dbMongo.find(doc, {});

        res.status(200).end(JSON.stringify(result));

        return
    } catch (error) {
        console.log(`${doc}/all`, error)

        const responseFail = new ResponseFail("error", error)

        res.status(200).end(responseFail);

        return
    }
})

module.exports = router;