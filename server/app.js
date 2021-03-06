const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();
const authRoutes = require('./routes/auth');
const cabinetRoutes = require('./routes/cabinet');

const mongoose = require('mongoose');
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error))

app.use(require('morgan')('dev'));
app.use(require('cors')());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/cabinet', cabinetRoutes);

app.use(passport.initialize());
require('./middleware/passport')(passport);

module.exports = app;
