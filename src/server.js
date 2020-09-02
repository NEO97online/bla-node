const http = require('http')
const port = process.env.PORT || 8144 // blaa
const host = process.env.HOST || 'localhost'

const users = []

function onClientConnection(socket) {
  // Tell existing users a new user joined
  for (const user of users) {
    user.socket.write(JSON.stringify({ nick: 'Bla', msg: 'A wild user has appeared' }))
  }

  users.push({ socket })
  
  let latestNick = "blanon"

  // keep the socket alive with a heartbeat every second
  const heartbeat = () => {
    if (!socket || socket.readyState !== 'open') {
      return
    }

    socket.write('h')
    setTimeout(heartbeat, 1000)
  }

  // initialize heartbeat on socket open
  heartbeat()

  socket.on('data', data => {
    const { nick, msg } = JSON.parse(data.toString())
    latestNick = nick
    // Log data from the client
    console.log(data.toString())
    // Send back the data to the client
    for (const user of users) {
      // Broadcast this message to other users expect the user who sent it
      if (user.socket !== socket) {
        user.socket.write(JSON.stringify({ nick, msg }))
      }
    }
  })

  // Handle client connection termination
  socket.on('close', () => {
    console.log(`${latestNick} terminated the connection`)
  })

  // Handle Client connection error
  socket.on('error', (error) => {
    console.error(`${latestNick} connection error ${error.message}`)
  })
}

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('ok')
})

server.on('upgrade', (_req, socket, _head) => {
  socket.write('HTTP/1.1 101 Bla Protocol Handshake\r\n' +
               'Upgrade: Bla\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n')
  
  onClientConnection(socket)
})

server.listen(port, () => {
  console.log(`Server started on ${host}:${port}`) 
})