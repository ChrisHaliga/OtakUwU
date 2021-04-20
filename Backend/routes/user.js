const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/*router.get('/', (req, res) => {
    res.send('hello');
})*/
router.route('/').get((req, res) => {
    console.log('inside get');
    User.find()
    .then(users => res.json(users))
    .catch(err => res.send(err));
    // .catch(err => res.status(400).json('Error: ' + err));
    // res.render('Platforms');
});

//sign up
router.route('/signup').post((req, res) => {
    console.log('inside signup');
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
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
            console.log('inside else');
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
                            password: hashedPassword
                        })
                        newUser.save()
                        .then(user => {
                            res.json({message: "saved successfully"})
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
    console.log('inside sign in');
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
                res.json({message: "Successful login"})
            }
            else {
                return res.status(422).json({error: "Invalid password"});
            }
        })
    }).catch(err=>console.log('Find by username error' + err));
});

//delete specific user
router.route('/:id').delete((req, res) => {
    console.log('inside delete');
    User.findByIdAndDelete(req.params.id)
    .then((deletedUser) => {
        if (deletedUser) {
            res.json('User deleted.');
        }
        else {
            res.status(404).json('User not found');
        }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

//get specific user 
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json('User not found');
        }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router