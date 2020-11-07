const express = require('express');

const router = express.Router();

const projects = require('../data/helpers/projectModel.js');

router.get('/', (req, res) => {    
    projects.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "An error occured when retrieving projects"
        });
    });
});

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
});

router.post('/', validateNewProject, (req, res) => {
    projects.insert(req.body)
    .then(project => {
        console.log(project)
        res.status(201).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "there was an error adding the project"
        })
    });
})

router.put('/:id', validateProjectId, validateNewProject, (req, res) => {
    projects.update(req.project.id, req.body)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "an error occured while updating the project"
        })
    })
})

router.delete('/:id', validateProjectId, (req, res) => {
    projects.remove(req.project.id)
    .then(success => {
        res.status(200).json({
            message: "the project was deleted"
        })
    })
    .catch(err => {
        res.status(500).json({
            message: "an error occured while removing the projectf rom the db"
        })
    })
})

function validateNewProject(req, res, next) {
    const body = req.body;
    if (!body || body === {}) {
        res.status(400).json({
            message: "missing project data"
        })
    } else {
        if (!body.name || !body.description) {
            res.status(400).json({
                message: "New projects require both a name and description"
            })
        } else {
            next()
        }
    }
}

function validateProjectId(req, res, next) {
    const {id} = req.params;
    projects.get(id)
    .then(project => {
        if(project) {
            req.project = project;
            next()
        } else {
            res.status(404).json({
                message: "project not found"
            })
        }        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: `An error occured when retrieving project id: ${id}`
        });
    });
}

module.exports = [
    router
]