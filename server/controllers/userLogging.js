import User from '../models/User';
import UserSession from '../models/UserSession';

let userLogging = {};

//sign the user up for an account if the email has not already been used
userLogging.signup = (req, res, next) => {
    const {body} = req;
    const {
        firstName,
        lastName,
        email,
        password
    } = body;

    if(!firstName){
        return res.send({
            success: false,
            message: 'First name cannot be blank.'
        });
    };

    if(!lastName){
        return res.send({
            success: false,
            message: 'Last name cannot be blank.'
        });
    };

    if(!email){
        return res.send({
            success: false,
            message: 'Email cannot be blank.'
        });
    };

    if(!password){
        return res.send({
            success: false,
            message: 'Password cannot be blank.'
        });
    };

    let emailLower = email.toLowerCase();

    //Steps
    // 1. Verify email doesn't exist
    // 2. Save user

    User.findOne({
        email: emailLower
    }, (err, previousUser) => {
        if(err){
            return res.send({
                success: false,
                message: 'Server Error'
            });
        } else if(previousUser){
            return res.send({
                success: false,
                message: 'Account address already exists.'
            });
        };

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: emailLower,
        });

        newUser.password = newUser.generateHash(password);

        newUser.save((err, user) => {
            if(err) {
                return res.send({
                    success: false,
                    message: 'Error saving new user.'
                });
            };
            return res.send({
                success: true,
                message: 'Account for ' + email + ' has been created.'
            });
        });

    });
};

//check username / password and give the user a token
userLogging.signin = (req, res, next) => {
    const {body} = req;
    const {password} = body;
    let {email} = body;

    email = email.toLowerCase();

    if(!email){
        return res.send({
            success: false,
            message: 'Email cannot be blank.'
        });
    };

    if(!password){
        return res.send({
            success: false,
            message: 'Password cannot be blank'
        });
    };

    User.find({
        email: email
    }, (err, users) => {
        if(err){
            return res.send({
                success: false,
                message: 'Server error finding email.'
            });
        };

        if(users.length != 1){
            return res.send({
                success: false,
                message: 'Invalid.'
            });
        };

        const user = users[0];
        if(!user.validPassword(password)){
            return res.send({
                success: false,
                message: 'Invalid Password.'
            });
        };

        const userSession = new UserSession();
        userSession.userId = user._id
        userSession.save((err, doc) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Server error saving session.'
                })
            }
            return res.send({
                success: true,
                message: 'Valid sign in.',
                token: doc._id   
            });
        });
    });


};

//verify the user has a valid token
userLogging.verify = (req, res, next) => {
    //get the token
    const {query} = req;
    const {token} = query;
    //verify the token is unique and is not deleted
    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if(err){
            return res.send({
                success: false,
                message: 'Server error finding session.'
            });
        }

        if(sessions.length != 1){
            return res.send({
                success: false,
                message: 'Invalid.'
            });
        } else {
            return res.send({
                success: true,
                message: 'Session Verified.'
            });
        }

    });
}

//logout
userLogging.logout = (req, res, next) => {
    //get the token
    const {query} = req;
    const {token} = query;
    //verify the token is unique and is not deleted
    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: {
            isDeleted: true
        }
    }, {}, (err, session) => {
        if(err){
            return res.send({
                success: false,
                message: 'Server error updating session.'
            });
        }

        if(!session){
            return res.send({
                success: false,
                message: 'Invalid session.'
            });
        } else {
            return res.send({
                success: true,
                message: 'Logged out.'
            });
        }

    });
}

export default userLogging;