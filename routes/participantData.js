const express = require('express');
const { isEmpty } = require('lodash');
const AWS = require('aws-sdk');

const ParticipantData = require('../models/participantData');
const router = express.Router();

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
    parameterLimit: 50000
}));

router.use(bodyParser.json({
    limit: '50mb'
}));

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

router.get('/ping', async (req, res) => {
    return res.json({
        message: 'Server available',
        statusCode: 200
    });
});

router.post('/add', async (req, res) => {
    if (isEmpty(req.body)) {
        return res.status(403).json({
            error: 'Body cannot be empty. Invalid request.',
            statusCode: 403
        });
    }

    const { participantID, coordXArray, coordYArray, sessionNumber, date } = req.body;
    const newParticipantData = new ParticipantData({
        participantID,
        coordXArray,
        coordYArray,
        sessionNumber,
        date
    });
    try {
        await newParticipantData.save();
        res.json({
            message: 'Data successfully saved',
            statusCode: 200
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({
            message: 'Internal Server error',
            statusCode: 500
        });
    }

});

router.post('/pushBodilyMap', (req, res) => {
    console.log(req);
    const params = {
        Bucket: 'bodilysensationimages',
        Key: req.body.participantImagePath,
        Body: req.body.participantImageData,
    };


    s3.putObject(params, (s3err, data) => {
        if(s3err) throw s3err;
        console.log(data);
    });

});

router.put('/update/:id', async (req, res) => {
    if(isEmpty(req.body)) {
        return res.status(403).json({
            error: 'Body cannot be empty. Invalid request.',
            statusCode: 403
        });
    }
});

//Returns the id numbers and coordinates of every participant in the study
router.post('/getAll', async (req, res) => {
    try {
        const allParticipants = await Participant.find({});
        return res.json({
            allParticipants
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server error'
        });
    }
});

module.exports = router;