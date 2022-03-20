const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const ParticipantSchema = new Schema({
    participantID: Number,
    sessionNumber: Number
});

const Participant = mongoose.model('Participant', ParticipantSchema);

module.exports = Participant;