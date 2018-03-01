const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const users = require('./data/users');

passport.use(new LocalStrategy(function (username, password, done) {
    const user = users.find(u => u.name === username);

    if (!user || user.password !== password) {
        done(null, false);
        return;
    }

    done(null, user);
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    const user = users.find(u => u.id === id);
    done(null, user);
});
