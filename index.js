const app = require('./app')
const port = process.env.PORT || 5000

app.ws('/chat', function(ws, req) {
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});
app.listen(port, () => console.log(`Server has been started on port: ${port}`))

