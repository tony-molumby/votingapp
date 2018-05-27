import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes';
//import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
//db connection
const dbURI = 'mongodb://localhost:27017/test'

mongoose.connect(dbURI, {}, (err) => {
    if(err) return err;
    console.log('Connected to mongodb');
})
.catch((err) => {
    console.log(err);
});

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
app.use('/api', routes);

export default app;


