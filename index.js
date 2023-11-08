const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(__dirname + '/index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    const staticDir = path.join(__dirname, 'public');

    if (req.url === '/public/style.css') {
        const cssPath = path.join(staticDir, 'style.css');
        const cssStream = fs.createReadStream(cssPath);

        res.writeHead(200, { 'Content-Type': 'text/css' });
        cssStream.pipe(res);
    } else {
        console.log('Request not for style.css');
    }

});

const io = require('socket.io')(server);
const port = 5000;

io.on('connection', (socket) => {
    socket.on('send name', (user) => {
        io.emit('send name', user);
    });

    socket.on('send message', (chat) => {
        io.emit('send message', chat);
    });
});

server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});
