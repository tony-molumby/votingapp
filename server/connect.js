import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

//db connection
mongoose.connect('mongodb://localhost:27017/find12steps',{
    useMongoClient: true
}, function(err){
    if(err) return err;
    console.log('Connected to mongodb');
});

export default mongoose;