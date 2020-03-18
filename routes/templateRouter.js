const express = require('express');
const templateController = require('../controllers/templateController.js');
const templateRouter = express.Router();

templateRouter.get('/', templateController.gettemplate);
templateRouter.post('/', templateController.posttemplate);

module.exports = templateRouter;
