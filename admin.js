const express = require('express');
const uuidv4 = require('uuid/v4');

const router = express.Router();
module.exports = router;

let rooms = require('./data/rooms');

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
    .get(function (req, res) {
        const room = rooms.filter(room => room.id === req.params.id)[0];

        if (!room) {
            res.sendStatus(404);
            return;
        }

        res.render('editRoom', { room });
    })
    .post(function (req, res) {
        const room = rooms.filter(room => room.id === req.params.id)[0];

        if (!room) {
            res.sendStatus(404);
            return;
        }

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
    res.render('users', { title: 'Admin Users' });
});
