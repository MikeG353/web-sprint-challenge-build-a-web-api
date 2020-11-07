const express = require('express');

const router = express.Router();

const projects = require('../data/helpers/projectModel.js');

router.get('/', (req, res) => {
    projects.get(req.query)
    .then(projects => {
        console.log(projects, '/api/projects/ get request')
        res.status(200).json(projects).send();
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "An error occured when retrieving projects"
        });
    });
});

module.exports = router;