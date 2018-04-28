import app from './app';
import express from 'express';

//Controller Imports
import meetingController from './controllers/meeting.controller';

const routes = express();

routes.post('/search', meetingController.post);

export default routes;