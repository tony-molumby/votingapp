import app from './app';
import express from 'express';

//Controller Imports
import basicController from './controllers/basic.controller';

const routes = express();

routes.post('/search', basicController.post);

export default routes;