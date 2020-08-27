const net = require('net')
const port = process.env.PORT || 8144 // blaa
const host = process.env.HOST || 'localhost'
const server = net.createServer(onClientConnection)

const users = []

function onClientConnection(sock) {
  users.push({ sock })

  sock.on('data', data => {
    // Log data from the client
    console.log(`${sock.remoteAddress}:${sock.remotePort} Says : ${data.toString()} `)
    // Send back the data to the client
    for (const user of users) {
      // Broadcast this message to other users expect the user who sent it
      if (user.sock !== sock) {
        user.sock.write(`Anon> ${data}`)
      }
    }
  })

  // Handle client connection termination
  sock.on('close', () => {
    console.log(`${sock.remoteAddress}:${sock.remotePort} Terminated the connection`)
  })

  // Handle Client connection error
  sock.on('error', (error) => {
    console.error(`${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`)
  })
}

server.listen(port, host, () => {
  console.log(`Server started on ${host}:${port}`) 
})