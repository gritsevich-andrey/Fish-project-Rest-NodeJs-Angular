const app = require('./app')
const port = process.env.PORT || 5000
const cors = require('cors');
const server = require('http' , {
    cors: {
        origin: '*'
    }
}).Server(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

let users = [];
app.listen(port, () => console.log(`Server has been started on port: ${port}`))

server.listen(3001, ()=>{
    console.log('Сервер для socket.io работает на порту 3001');
});


io.on('connection', socket => {
    console.log('Клиент присоединился');
users.push(socket);
console.log(users);
});