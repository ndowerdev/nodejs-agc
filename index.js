const http = require('http')
const server = require('./api/server')
require('dotenv').config()
// const fs = require('fs')
const isBot = require('isbot')

const port = process.env.PORT || 8998
const host = process.env.HOST || '127.0.0.1'
http.createServer((req, res) => {
  const isBotx = isBot(req.headers['user-agent'])
  server(req, res, isBotx)
}).listen(port, () => {
  console.log(`App running on ${host}`)
})
