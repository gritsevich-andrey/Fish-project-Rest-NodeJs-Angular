const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');

app.use(require('morgan')('dev'));
app.use(require('cors')());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

module.exports = app;
