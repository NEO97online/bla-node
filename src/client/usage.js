const commands = {
  help: {
    description: "Shows usage of a command"
  },
  connect: {
    description: "Connect to a specific server and port"
  },
  disconnect: {
    description: "Connect to a specific server",
  },
  quit: {
    description: "Alias for disconnect"
  },
  exit: {
    description: "Alias for disconnect"
  },
  nick: {
    description: "Assign yourself a nickname"
  }
}

/*
TODO: align columns
1. length = longest key + 2
2. test each usage length, add spaces to match length
*/

const entries = Object.keys(commands)//.sort((a) => a === 'help')

function getUsage(cmd) {
  if (!commands[cmd]) {
    return `Command ${cmd} does not exist`
  }

  const data = commands[cmd]
  let usage = `/${cmd}: ${data.description}\n`
  if (data.aliases) {
    for (const alias of data.aliases) {
      usage += `/${alias}: Alias for ${cmd}\n`
    }
  }
  return usage
}

module.exports = function buildUsage(args) {

  let usage = '\n'

  if (!args || args.length === 0) {
    for (const cmd of entries) {
      usage += getUsage(cmd)
    }

    return usage
  }

  if (args.length > 1) { 
    return 'Choose one argument'
  }

  usage += getUsage(args[0])

  return usage
  
}