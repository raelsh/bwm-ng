const UserModel = require('../models/user');
const { normalizeError } = require('../helpers/moongose');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');

exports.auth = function (req, res) {
    const { email, password } = req.body
    if (!password || !email) {
        return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'provide email and passsword' }] });
    }
    UserModel.findOne({ email }, function (err, user) {
        if (err) {
            return res.status(422).send({ errors: normalizeError(err.errors) });
        }
        if (!user) {
            return res.status(422).send({ errors: [{ title: 'Invalid User!', detail: 'User doesnt exist!' }] });
        }
        if (user.hasSamePassword(password)) {
            const token = jwt.sign({
                userId: user.id,
                username: user.username
            }, config.SECRET, { expiresIn: '1h' });

            return res.json(token);
        } else {
            return res.status(422).send({ errors: [{ title: 'Wrong Data!', detail: 'Wrong email or password!' }] });
        }
    })
}

exports.register = function (req, res) {
    const { username, email, password, passwordConfirmation } = req.body;
    if (!password || !email) {
        return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'provide email and passsword' }] });
    }
    if (password !== passwordConfirmation) {
        return res.status(422).send({ errors: [{ title: 'Invalid password!', detail: 'Password and confirmation are not the same' }] });
    }

    UserModel.findOne({ email }, function (err, existingUser) {
        if (err) {
            return res.status(422).send({ errors: normalizeError(err.errors) });
        }
        if (existingUser) {
            return res.status(422).send({ errors: [{ title: 'Invalid email!', detail: 'Email already in use' }] });
        }
        const user = new UserModel({
            username,
            email,
            password
        });
        user.save(function (err) {
            if (err) {
                return res.status(422).send({ errors: normalizeError(err.errors) });
            }
            return res.json({ 'registered': 'true' });
        });
    });
}

exports.authMiddleware = function (req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        const user = parseToken(token);
        UserModel.findById(user.userId, function (err, user) {
            if (err) {
                return res.status(422).send({ errors: normalizeError(err.errors) });
            }
            if (user) {
                res.locals.user = user;
                next();
            } else {
                return notAuthorized(res);
            }
        })
    } else {
        return notAuthorized(res);
    }
}

function parseToken(token) {
    return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res){
    return res.status(401).send({ errors: [{ title: 'No authorization!', detail: 'You need to login to get access' }] });
}