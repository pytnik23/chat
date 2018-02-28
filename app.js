const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const adminRouter = require('./admin');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin', adminRouter);

app.get('/', function (req, res) {
    res.render('index', { title: 'Chat App' });
});

app.listen(PORT, function () {
    console.log(`Chat app listening on port ${PORT}`);
});
