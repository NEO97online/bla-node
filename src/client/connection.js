const http = require('http')

// Client socket connection
module.exports = function createConnection(host, port, onMessage) {
  return new Promise((resolve, reject) => {
    const req= http.request({
      host,
      port,
      headers: {
        'Connection': 'Upgrade',
        'Upgrade': 'Bla'
      }
    })
    
    req.end()
    
    req.on('upgrade', (_res, socket, _upgradeHead) => {
      onMessage('Bla', 'got upgraded!')
      onMessage('Bla', `You have to connected to ${host}:${port}`)

      socket.on('data', data => {
        // data is a Buffer
        // data will be return JSON
        // Use JSON for MVP, Custom protocol for production
        // { "nick": string, "msg": string }

        const strData = data.toString()

        // ignore "h" heartbeat messages from the server
        if (strData === 'h') {
          return
        }
      
        const msgObj = JSON.parse(strData)

        onMessage(msgObj.nick, msgObj.msg)
      })
      
      socket.on('error', (error) => {
        console.error('Something went wrong when connecting to socket.: ' + error)
        reject(error)
      })
      
      socket.on('end', () => {
        console.log('disconnected from server')
      })

      resolve(socket)
    })
  })
}