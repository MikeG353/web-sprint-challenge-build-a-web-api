const express = require('express');

const router = express.Router();

const actions = require('../data/helpers/actionModel.js');
const projects = require('../data/helpers/projectModel.js')

router.get('/', (req, res) => {
    actions.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "An error occured when retrieving actions"
        });
    });
});

router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json(req.action)
})

router.post('/:id', validateProjectId, validateNewAction, (req, res) => {
    actions.insert(req.body)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "an error occured while adding the action"
        })
    })
})

router.put('/:id', validateActionId, validateUpdatedAction, (req, res) => {
    actions.update(req.action.id, req.body)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "an error occured while updating the action"
        })
    })
})

router.delete('/:id', validateActionId, (req, res) => {
    actions.remove(req.action.id)
    .then(success => {
        res.status(200).json({
            message: `action id: ${req.action.id} was deleted`
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "an error occured while removing the action from the db"
        })

    })
})

function validateActionId(req, res, next) {
    const {id} = req.params;
    actions.get(id)
    .then(action => {
        if (action) {
            req.action = action;
            console.log(action)
            next();
        } else {
            res.status(404).json({
                message: `an action with id:${id} does not exist`
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).jso({
            message: `an error occured while retrieving action id: ${id}`
        })
    })
}

function validateNewAction(req, res, next) {
    const body = req.body;
    if (!body || body === {}) {
        res.status(400).json({
            message: "missing action data"
        })
    } else {
        if (!body.notes || !body.description) {
            res.status(400).json({
                message: "New actions require both a notes and description field"
            })
        } else {
            req.body.project_id = req.project.id || req.action.project_id
            next()
        }
    }
}

function validateUpdatedAction(req, res, next) {
    const body = req.body;
    if (!body || body === {}) {
        res.status(400).json({
            message: "missing action data"
        })
    } else {
        if (!body.notes || !body.description) {
            res.status(400).json({
                message: "Updated actions require both a notes and description field"
            })
        } else {
            req.body.project_id = req.action.project_id
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
module.exports = router;