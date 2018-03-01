const express = require('express');
const passport = require('passport');

const user = require('./data/users')[0];

const router = express.Router();
module.exports = router;

router.get('/login', function (req, res) {
    if (req.app.get('env') === 'development') {
        req.logIn(user, function (err) {
            if (err) return next(err);

            return res.redirect('/');
        });
    } else {
        res.render('login');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});
