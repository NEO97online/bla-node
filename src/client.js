// Interactive Mode
const readline = require('readline')
const net = require('net')

const port =
 process.env.PORT
  // || process.env.argv[] // Flag for specified port
  || 8144 // blah
const host = process.env.HOST || 'localhost'

let nick = 'blanon'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: nick + '> '
})

const history = []

function render() {
  console.clear()

  for (const message of history) console.log(message)

  rl.prompt()
}

function printMessage(nickname, msg, ...string) {
  history.push(`${nickname}> ${msg}`)
}

// Render prompts
render()

// Continue prompt
rl.on('pause', () => { // Keep for now. Potenial middleware?
  render()
})

function exit() {
  console.clear()
  console.log('You left the chat.')
  process.exit(0)
}

rl.on('line', (msg) => {

  if (msg.startsWith('/')) {
    const args = msg.slice(1).split(/\s+/g) // Split by all white spaces
    const cmd = args.shift()

    switch (cmd) { 
      case 'disconnect':
      case 'quit':
      case 'exit':
        exit()
        break
      case 'nick':
      case 'username':
      case 'nickname':
        nick = args[0]
        rl.setPrompt(nick + '> ')
        break
      default: 
        printMessage('Bla', 'Invalid Command: ' + cmd)
        break
    }
  } else {
    // write local message
    printMessage(nick, msg)
    // broadcast message
    conn.write(JSON.stringify({ nick, msg }))
  }
  
  console.clear()
  rl.pause()
})

// Client socket connection
const conn = net.connect({ host, port }, () => {
  printMessage('Bla', `You have to connected to ${host}:${port}`)
  render()
})

conn.on('data', data => {
  // data is a Buffer
  // data will be return JSON
  // Use JSON for MVP, Custom protocol for production
  // { "nick": string, "msg": string }

  const msgObj = JSON.parse(data.toString())
  console.log(msgObj)
  printMessage(msgObj.nick, msgObj.msg)
  render()
})

conn.on('error', (error) => {
  console.error('Something went wrong when connecting to socket.: ' + error)
})

conn.on('end', () => {
  console.log('disconnected from server')
})

rl.on('SIGINT', exit)