const net = require('net');
const port = process.env.PORT || 8144; // blaa
const host = process.env.HOST || '127.0.0.1';

const server = net.createServer(onClientConnection)

const users = []

function onClientConnection(sock) {
  users.push({ sock })

  sock.on('data', data => {
    // Log data from the client
    console.log(`${sock.remoteAddress}:${sock.remotePort} Says : ${data.toString()} `);
    // Send back the data to the client.
    //sock.write(`Username> ${data}`);
    for (const user of users) {
      if (user.sock !== sock) {
        user.sock.write(`Anon> ${data}`)
      }
    }
  });

  // Handle client connection termination.
  sock.on('close', () => {
    console.log(`${sock.remoteAddress}:${sock.remotePort} Terminated the connection`);
  });

  // Handle Client connection error.
  sock.on('error', (error) => {
    console.error(`${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`);
  });
}

server.listen(port, host, () => {
  console.log(`Server started on ${host}:${port}`); 
})