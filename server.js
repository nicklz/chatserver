const net = require('net');
const sockets = [];
const port = 8080;
let userId = 0;

const server = net.createServer((socket) => {
  // Increment
  userId++;

  socket.username = "User " + userId;
  let clientName = socket.username;

  sockets.push(socket);

  // Welcome user to the socket
  socket.write("Welcome to telnet chat!\n");

  // Broadcast to others excluding this socket
  broadcast(clientName, clientName + ' joined this chat.\n');

  // When client sends data
  socket.on('data', (data) => {
    let message = `${clientName} > ${data.toString()}`

    broadcast(clientName, message);

    // Log it to the server output
    process.stdout.write(message);
  });


  // When client leaves
  socket.on('end', () => {
    let message = clientName + ' left this chat\n';
    // Log it to the server output
    process.stdout.write(message);

    // Remove client from socket array
    removeSocket(socket);

    // Notify all clients
    broadcast(clientName, message);
  });

  // When socket gets errors
  socket.on('error', (error) => {
    console.log('Socket got problems: ', error.message);
  });
});

// Broadcast to others, excluding the sender
const broadcast = (from) => {
  // If there are no sockets, then don't broadcast any messages
  if (sockets.length === 0) {
    process.stdout.write('Everyone left the chat');
    return;
  }

  // If there are clients remaining then broadcast message
  sockets.forEach((socket) => {
    // Dont send any messages to the sender
    if (socket.username === from) return;
  });
};

// Remove disconnected client from sockets array
const removeSocket = (socket) => {
  sockets.splice(sockets.indexOf(socket), 1);
};

// Listening for any problems with the server
server.on('error', (error) => {
  console.log("So we got problems!", error.message);
});

// Listen for a port to telnet to
// then in the terminal just run 'telnet localhost [port]'
server.listen(port, function () {
  console.log("Server listening at http://localhost:" + port);
});
