// Interactive Mode
const readline = require('readline')
const createConnection = require('./connection')
const parseArgs = require('./parse-args')
const getUsage = require('./usage')
  
async function main() {
  const history = []
  let conn

  let { 
    host = "localhost", 
    port = 8144, 
    nick = "blanon",
    message, 
  } = parseArgs(process.argv.slice(2))

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: nick + '> ',
  })

  function printMessage(nickname, msg) {
    history.push(`${nickname}> ${msg}`)
  }

  function render() {
    clear()
  
    for (const message of history) console.log(message)
  
    rl.prompt(true)
  }

  function sendMessage(nick, msg, callback) {
    // write local message
    printMessage(nick, msg)
    // broadcast message
    conn.write(JSON.stringify({ nick, msg }), callback)
  }

  function clear() {
    if (process.env.DEBUG === false) {
      console.clear()
    }
  }

  function exit(message) {
    clear()
    if (!message) {
      console.log('You left the chat.')
    }
    conn.end()
    setTimeout(() => {
      process.exit(0)
    }, 100)
  }

  async function connect(host, port) {
    printMessage('Bla', `Connecting to ${host}:${port}...`)
    conn = await createConnection(host, port, (senderNick, message) => {
      printMessage(senderNick, message)
      render()
    })
    
    if (message && message.length > 0) {
      sendMessage(nick, message, () => exit(message))
    }
  }

  if (host || port) {
    connect(host, port)
  }
  
  // Render prompts
  render()
  
  rl.on('line', (msg) => {
  
    if (msg.length === 0) {
      render()
      return
    }

    if (msg.length >= 140 ) {
      printMessage('Bla', 'Must have less than 140 characters.')
      render()
      return
    }

    if (msg.startsWith('/')) {
      const args = msg.slice(1).split(/\s+/g) // Split by all white spaces
      const cmd = args.shift()
  
      switch (cmd) { 
        case 'help':
          printMessage('Bla', getUsage(args))
          break
        case 'connect':
          const address = args[0]
          const port = address.substring(address.lastIndexOf(':') + 1, address.length)
          const host = address.substring(0, address.lastIndexOf(':'))
          conn = connect(host, port)
          break
        case 'disconnect':
        case 'quit':
        case 'exit':
          exit()
          break
        case 'nick':
        case 'username':
        case 'nickname':
          nick = args[0]

          if (nick === 'Bla') {
            printMessage('Bla', 'This is a reserved name.')
          }

          rl.setPrompt(nick + '> ')
          break
        default: 
          printMessage('Bla', 'Invalid Command: ' + cmd)
          break
      }
    } else {
      sendMessage(nick, msg)
    }
    
    clear()
    render()
  })
  
  // exit on interrupt signal (Ctrl+C usually)
  rl.on('SIGINT', exit)
}

main()