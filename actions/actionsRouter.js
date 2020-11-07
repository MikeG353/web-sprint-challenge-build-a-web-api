const express = require('express');

const router = express.Router();

const actions = require('../data/helpers/actionModel.js');

router.get('/', (req, res) => {
    actions.get(req)
    .then(actions => {
        console.log(actions)
        res.status(200).json(actions);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "An error occured when retrieving actions"
        });
    });
});

module.exports = router;