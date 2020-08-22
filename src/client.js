// Interactive Mode
const readline = require('readline')
const net = require('net')

const username = 'Me> '

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: username
})

const history = [
  'Clark Kozak> yo whats up',
  'CoreAPI> Deployment to Heroku failed!'
]

function render() {
  console.clear()

  for (const message of history) console.log(message)

  rl.prompt()
}

// Render prompts
render()

// Continue prompt
rl.on('pause', () => { // Keep for now. Potenial middleware?
  render()
})

rl.on('line', (msg) => {
  history.push(username + msg)
  client.write(msg)
  
  console.clear()
  rl.pause()
});

// Client socket connection
const client = net.connect({ port: 8144 }, () => {
   console.log('connected to server')
})

client.on('data', data => {
  // data is a Buffer
  history.push(data.toString())
  render()
})

client.on('error', (error) => {
  console.error('Something went wrong when connecting to socket.: '+ error)
})

client.on('end', () => {
  console.log('disconnected from server')
})

rl.on('SIGINT', () => {
  console.clear()
  console.log('You left the chat.')
  process.exit(0)
})