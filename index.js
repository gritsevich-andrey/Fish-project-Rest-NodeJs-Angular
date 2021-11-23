const app = require('./app')
const port = process.env.PORT || 5000
const portSocket = process.env.PORT || 3001
const cors = require('cors');
const server = require('http', {
    cors: {
        origin: "http://localhost:4200",
        credentials: true,
        methods: ["GET", "POST"]
    }
}).Server(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:4200",
        credentials: true,
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.listen(port, () => console.log(`Server has been started on port: ${port}`))

server.listen(portSocket, () => {
    console.log('Сервер для socket.io работает на порту 3001');
});


io.on('connection', socket => {
    console.log('Клиент присоединился, id:', socket.id);
    socket.on('chat', (data) => {
        const room = data.userEmail + '-' + data.receiverEmail;
        socket.join(room);
        // console.log('Название комнаты', room);
        io.sockets.in(room).emit('newMessage', data);
        // socket.to(room).emit('newMessage', data);
    })
});
