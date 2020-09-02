// Interactive Mode
const readline = require('readline')
const createConnection = require('./connection')

const port =
 process.env.PORT
  // || process.env.argv[] // Flag for specified port
  || 8144 // blah
  const host = process.env.HOST || 'localhost'
  
async function main() {
  const history = []
  let nick = 'blanon'
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: nick + '> '
  })

  const conn = await createConnection(host, port, (senderNick, message) => {
    printMessage(senderNick, message)
    render()
  })
  
  function render() {
    console.clear()
  
    for (const message of history) console.log(message)
  
    rl.prompt(true)
  }
  
  function printMessage(nickname, msg) {
    history.push(`${nickname}> ${msg}`)
  }
  
  // Render prompts
  render()
  
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
    render()
  })
  
  // exit on interrupt signal (Ctrl+C usually)
  rl.on('SIGINT', exit)
}

main()