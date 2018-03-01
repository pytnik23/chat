const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./logger');
const passport = require('passport');
const session = require('express-session');

require('./passport-init');

const authRouter = require('./auth');
const adminRouter = require('./admin');
const apiRouter = require('./api');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);

app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
    } else {
        res.redirect('/login');
    }
});

app.use(function(req, res, next) {
    res.locals.currentUrl = req.originalUrl;
    next();
});

app.get('/', function (req, res) {
    res.render('home', { title: 'Chat App' });
});

app.use('/admin', adminRouter);
app.use('/api', apiRouter);

app.listen(PORT, function () {
    console.log(`Chat app listening on port ${PORT}`);
});
