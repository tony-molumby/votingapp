import app from './app';
import express from 'express';

//Controller Imports
import userLogging from './controllers/userLogging';

const routes = express();

routes.post('/signup', userLogging.signup);
routes.post('/signin', userLogging.signin);
routes.get('/verify', userLogging.verify);
routes.get('/logout', userLogging.logout);

export default routes;