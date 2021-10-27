const express = require('express');
const passport = require('passport')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const cabinetRoutes = require('./routes/cabinet');
const complaintRoutes = require('./routes/complaint');
const administratorRoutes = require('./routes/administrator');
const photoRoutes = require('./routes/photo');

const mongoose = require('mongoose');
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'));
app.use('/uploads', express.static('uploads'));
app.use(require('cors')());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors({
    origin: ['localhost:4200']
}));
app.use('/api/auth', authRoutes);
app.use('/api/cabinet', cabinetRoutes);
app.use('/api/photo', photoRoutes);
app.use('/api/complaint', complaintRoutes);
app.use('/api/administrator', administratorRoutes);
app.use('/api/photo', photoRoutes);



module.exports = app;
