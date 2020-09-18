
module.exports = function parseArgs(args) {  
  let port, host, nick, message

  for (let i = 0; i < args.length; i++) { 
    switch (args[i]) {
      case '-p':
      case '--port':
        port = args[i + 1]
        i++
        break
      case '-h':
      case '--host':
        host = args[i + 1]
        i++
        break
      case '-n':
      case '--nick':
        nick = args[i + 1]
        i++
        break
      case '-m':
      case '--message':
        message = args[i + 1]
        i++
        break
      default:
        console.log('Invalid argument: ' + args[i])
    }
  }

  return { port, host, nick, message }
}
