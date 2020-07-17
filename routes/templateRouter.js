const express = require('express');
const templateController = require('../controllers/templateController.js');
const templateRouter = express.Router();

templateRouter.get('/', templateController.gettemplate);
templateRouter.post('/', templateController.posttemplate);
templateRouter.post('/check/:id', templateController.checktemplate);
templateRouter.post('/checkall', templateController.checkalltemplate);
templateRouter.get('/downloancsv', templateController.getdownloan);

module.exports = templateRouter;
