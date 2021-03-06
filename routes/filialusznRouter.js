const express = require('express');
const filialusznController = require('../controllers/filialusznController.js');
const filialusznRouter = express.Router();

filialusznRouter.get('/', filialusznController.getfilialsUSZN);
filialusznRouter.get('/create', filialusznController.addfilialUSZN);
filialusznRouter.post('/create', filialusznController.postfilialUSZN);
filialusznRouter.get('/edit/:id', filialusznController.editfilialUSZN);
filialusznRouter.post('/edit', filialusznController.updatefilialUSZN);
filialusznRouter.post('/delete/:id', filialusznController.deletefilialUSZN);
filialusznRouter.post('/directory', filialusznController.postDirectory);
filialusznRouter.post('/unarchive', filialusznController.postUnarchive);
filialusznRouter.post('/archive', filialusznController.postArchive);
filialusznRouter.post('/dbfdelete', filialusznController.postDBFdelete);

module.exports = filialusznRouter;