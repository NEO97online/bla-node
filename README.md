# bla

`bla` is short for `blah` or `hablar`.

The objective is to have a simple terminal chat. Usable by humans (interactive mode) and machines (non-interactive mode). 

## Server

### Setup

The best way to see a demo of `bla` is to use the `src/server.js`

Heroku is the easiest way to have a demo server. 

`npm start` is mapped to `npm run server` which runs `src/server.js`

Fork the project and deploy with [Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)
## Client

### Connecting

If Heroku is being used, the port will be 80. APP_NAME is the name of the Heroku app.

`npm run client -- --host APP_NAME.herokuapp.com --port 80`

### Interactive Mode

Use `/help` to see a list of commands in interactive mode.

### Non interactive Mode

See [usage.js](/src/client/usage.js) to see a list of arguments in an object. It's an MVP, what can you expect?

`npm run client -- --message "This is a your message" --nick "Some API"`

## Future Development

See the section "Backburner" in our enterprise-grade project management software: [notes.md](notes.md)