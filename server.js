const express = require('express');
const morgan = require('morgan');

const server = (express());
const actionsRouter = require('./actions/actionsRouter.js')
const projectsRouter = require('./projects/projectsRouter.js')

server.use(express.json());
server.use(morgan('dev'));
server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)

server.get('/', (req, res) => {
    res.send(`<h2>Unit 1 Sprint</h2>`);
});

module.exports = server;