const express = require('express');
const uuidv4 = require('uuid/v4');

let users = require('./data/users');
let rooms = require('./data/rooms');
let messages = require('./data/messages');

const router = express.Router();
module.exports = router;

router.get('/rooms', function (req, res) {
    res.json(rooms);
});

router.route('/rooms/:roomId/messages')
    .all(function (req, res, next) {
        const room = rooms.find(room => room.id === req.params.roomId);
        if (!room) {
            res.sendStatus(404);
            return;
        }

        res.locals.room = room;
        next();
    })
    .get(function (req, res) {
        const roomMessages = messages
            .filter(m => m.roomId === req.params.roomId)
            .map(m => {
                const user = users.find(u => u.id === m.userId);
                return { text: `${user.name}: ${m.text}` };
            });

        res.json({
            room: res.locals.room,
            messages: roomMessages,
        });
    })
    .post(function (req, res) {
        const message = {
            roomId: req.params.roomId,
            text: req.body.text,
            userId: req.user.id,
            id: uuidv4(),
        };

        messages = [ ...messages, message];
        res.sendStatus(200);
    })
    .delete(function (req, res) {
        messages = messages.filter(m => m.roomId !== req.params.roomId);
        res.sendStatus(200);
    });
