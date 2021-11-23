const express = require('express');
const passport = require('passport')
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const cabinetRoutes = require('./routes/cabinet');
const complaintRoutes = require('./routes/complaint');
const administratorRoutes = require('./routes/administrator');
const photoRoutes = require('./routes/photo');
const chatRoutes = require('./routes/chat')
const commentsRoutes = require('./routes/comments')
const travelsRoutes = require('./routes/travel')

const mongoose = require('mongoose');
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors({
    origin: ['localhost:4200']
}));
app.use('/api/auth', authRoutes);
app.use('/api/cabinet', cabinetRoutes);
app.use('/api/complaint', complaintRoutes);
app.use('/api/administrator', administratorRoutes);
app.use('/api/photo', photoRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/travels', travelsRoutes);
app.use('/chat', chatRoutes);

if (process.env.NODE_ENV === 'production') {
app.use(express.static('client/dist/fish'))
    app.get('*', (req, res) => {
res.sendFile(
    path.resolve(
        __dirname, 'client', 'dist', 'fish', 'index.html'
    )
)
    })
}

module.exports = app;
