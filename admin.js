const express = require('express');
const uuidv4 = require('uuid/v4');

let rooms = require('./data/rooms');
let users = require('./data/users');

const router = express.Router();
module.exports = router;

router.use(function (req, res, next) {
    req.user.admin
        ? next()
        : res.redirect('/login');
});

router.get('/rooms', function (req, res) {
    res.render('rooms', {
        title: 'Admin Rooms',
        rooms,
    });
});

router.route('/rooms/add')
    .get(function (req, res) {
        res.render('addRoom');
    })
    .post(function (req, res) {
        const room = {
            name: req.body.name,
            id: uuidv4(),
        };

        rooms.push(room);

        res.redirect(req.baseUrl + '/rooms');
    });

router.route('/rooms/edit/:id')
    .all(function (req, res, next) {
        const room = rooms.find(room => room.id === req.params.id);

        if (!room) {
            res.sendStatus(404);
            return;
        }

        res.locals.room = room;
        next();
    })
    .get(function (req, res) {
        res.render('editRoom');
    })
    .post(function (req, res) {
        rooms = rooms.map(room => {
            return room.id === req.params.id
            ? { ...room, name: req.body.name }
            : room;
        });

        res.redirect(req.baseUrl + '/rooms');
    });

router.get('/rooms/delete/:id', function (req, res) {
    rooms = rooms.filter(room => room.id !== req.params.id);

    res.redirect(req.baseUrl + '/rooms');
});

router.get('/users', function (req, res) {
    res.render('users', {
        title: 'Admin Users',
        users,
    });
});
