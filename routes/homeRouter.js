const express = require('express');
const homeController = require('../controllers/homeController.js');
const homeRouter = express.Router();

homeRouter.get('/', homeController.index);
homeRouter.get('/filialuszn', homeController.filialuszn);
homeRouter.get('/template', homeController.template);
homeRouter.get('/about', homeController.about);

module.exports = homeRouter;
