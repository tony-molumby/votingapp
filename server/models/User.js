import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});


UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//try refactoring this with ES6 and the .call method for practice and see if it works
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

export default User;