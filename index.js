const http = require('http');
// fs is (File System)
const fs = require('fs');
const socketIo = require('socket.io');
const path = require('path');

const port = 5000;
const server = http.createServer((req, res) => {
// checking if its a root url
    if (req.url === '/') {
        // path the html index page
        fs.readFile(__dirname + '/index.html', (err, data) => {
            if (err) {
                // shown when there is issue with loading index.html
                res.writeHead(500);
                // error 500 is internal server error
                res.end('Error loading index.html');
            } else {
                // The 200 OK status code means that the request was successful
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Import CSS on NodeJS without Express but some how this code is not working
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

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('send name', (user) => {
        io.emit('send name', user);
    });

    socket.on('send message', (chat) => {
        io.emit('send message', chat);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
