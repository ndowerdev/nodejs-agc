const glob = require('glob')
// const options = {}
const array = []
const files = glob.sync('./rules/*.js')
files.forEach((file) => {
  const conf = require(file)
  array.push(conf)
})

module.exports = array
