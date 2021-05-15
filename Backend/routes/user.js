const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET;

//for testing purposes
router.route('/').get((req, res) => {
    //console.log('inside get');
    User.find()
    .then(users => res.json(users))
    .catch(err => res.send(err));
    // .catch(err => res.status(400).json('Error: ' + err));
    // res.render('Platforms');
});

//sign up
router.route('/signup').post((req, res) => {
    //console.log('inside signup');
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    //console.log(username, password, email);
    //res.send(req.body.username);
    if (!username || !email || !password) {
        return res.status(422).json({error: "please add all fields"});
    }
    User.findOne({email: email})
    .then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({error: "User already exists with that email"});
        }
        else {
            //console.log('inside else');
            User.findOne({username: username})
            .then((savedUser) => {
                if (savedUser) {
                    return res.status(422).json({error: "User already exists with that username"});
                }
                else {
                    bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const newUser = new User({
                            username,
                            email, 
                            password: hashedPassword,
                        })
                        newUser.save()
                        .then(user => {
                            const token = jwt.sign({_id:user._id, date: Date.now()}, secret); //make more unique
                            User.updateOne({_id: user_id}, {token: token}).then(sameuser => {
                                res.json({token: token})
                            }).catch(err => console.log(err));
                        }).catch(err => {
                            console.log(err);
                        })
                    })
                }
            }).catch(err=>console.log('Find by username error' + err));
        }
    }).catch(err=>console.log('Find one error' + err));
});

//sign in
router.route('/signin').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(422).json({error: "please add all fields"});
    }
    User.findOne({username: username})
    .then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({error: "Invalid username or password"});
        }
        bcrypt.compare(password, savedUser.password)
        .then(matched => {
            if (matched) {
                const token = jwt.sign({_id:savedUser._id, date: Date.now()}, secret); //make more unique
                User.updateOne({_id: savedUser._id}, {token: token}).then(user => {
                    //console.log("sending token");
                    res.json({token: token})
                }).catch(err => console.log(err));
            }
            else {
                return res.status(422).json({error: "Invalid password"});
            }
        })
    }).catch(err=>console.log('Find by username error' + err));
});

//sign out - check token, then delete token
router.route('/signout').post((req, res) => {
    token = req.body.token;
    if (token) {
    User.findOneAndUpdate({token: token}, {$set: {token: null}})
    .then((foundUser) => {
        if (foundUser) {
            res.json('User signed out!')
        }
        else {
            return res.status(422).json({error: "User not found"});
        }
        
    })
    .catch(err => res.status(400).json('Error: ' + err));
    }
    else {
        return res.status(422).json({error: "User not logged in!"});
    }
});

//update - check token
router.route('/update').post((req, res) => {
    token = req.body.token;
    if (token) {
    User.findOneAndUpdate({token: token}, {$set: req.body})
    .then((foundUser) => {
        if (foundUser) {
            res.json('User updated!');
        }
        else {
            return res.status(422).json({error: "User not found"});
        }
        
    })
    .catch(err => res.status(400).json('Error: ' + err));
    }
    else {
        return res.status(422).json({error: "User not logged in!"});
    }
});

//delete specific user - also check token
router.route('/delete').delete((req, res) => {
    //console.log('inside delete');
    token = req.body.token;
    if (token) {
        User.findOneAndDelete({token: token})
        .then((deletedUser) => {
            if (deletedUser) {
                res.json('User deleted.');
            }
            else {
                res.status(404).json('User not found');
            }
        }).catch(err => res.status(400).json('Error: ' + err));
    }
    else {
        return res.status(422).json({error: "User not logged in!"});
    }
});

//get specific user - by username
router.route('/:username').get((req, res) => {
    User.findOne({username: req.params.username})
    .then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({error: "User not found"});
        }
        else {
            res.json('User found');
        }
    }).catch(err=>console.log('Find by username error' + err));
});

module.exports = router