const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require("express-validator");

const TrainingGroup = require("../models/TrainingGroup");
const Member = require("../models/Member");

// @routes    Get api/training-group
// @desc      Get all training-groups
// @access    Private
router.get("/", auth, async (req, res) => {
    try {
        if (req.member.role === ('admin' || 'superUser')) {
            trainingGroup = await TrainingGroup.find({}).sort({
                trainingGroup: -1
            });
        } else {
            trainingGroup = await TrainingGroup.find({ members: req.member._id }).sort({
                trainingGroup: -1
            });
        }

        res.json(trainingGroup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fehler");
    }
});

// @routes    POST api/training-group
// @desc      Add new training-group
// @access    Private
router.post(
    "/",
    [
        auth,
        [
            check('trainingGroup', 'Welche Gruppe?').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { trainingGroup } = req.body;

        try {
            const newTrainingGroup = new TrainingGroup({
                trainingGroup,
                members: [],
                trainingSessions: []
            });

            const group = await newTrainingGroup.save();

            res.json(group);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Fehler");
        }
    }
);

// @routes    Put api/trainingGroup/:id
// @desc      Update trainingGroup
// @access    Private
router.put("/:_id", auth, async (req, res) => {
    const { trainingGroup, members, trainingSessions } = req.body;

    // Build trainingGroup object
    const trainingGroupFields = { members: [], trainingSessions: [] };
    if (trainingGroup) trainingGroupFields.trainingGroup = trainingGroup;
    if (members) trainingGroupFields.members = members;
    if (trainingSessions) trainingGroupFields.trainingSessions = trainingSessions;
    try {
        let trainingGroup = await TrainingGroup.findById(req.params._id);

        if (!trainingGroup) return res.status(404).json({ msg: 'Trainingsgruppe nicht gefunden' });

        trainingGroup = await TrainingGroup.findByIdAndUpdate(req.params._id,
            { $set: trainingGroupFields },
            { new: true });

        res.json(trainingGroup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }

});

// @routes    Delete api/trainingGroup/:id
// @desc      Delete trainingGroup
// @access    Private
router.delete("/:_id", auth, async (req, res) => {
    try {
        let trainingGroup = await TrainingGroup.findById(req.params._id);

        if (!trainingGroup) return res.status(404).json({ msg: 'Trainingsgruppe nicht gefunden' });

        await TrainingGroup.findByIdAndRemove(req.params._id);

        res.json('Trainingsgruppe gel??scht');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fehler');
    }
});

module.exports = router;
