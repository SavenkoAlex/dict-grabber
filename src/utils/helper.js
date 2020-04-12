const fs = require('fs')
const { EventEmitter } = require('events')
const path = require('path')
const emitter = new EventEmitter()

const cacheFilePath = 'cache'
const dictFile = path.dirname.join('dict/dict')

module.exports = {
  getCache: () => {
    return new Promise((resolve, reject) => {
      fs.readFile(cacheFilePath, 'utf8', (err, file) => {
        if (err) {
          fs.writeFile(cacheFilePath, '', {}, err => {
            if (err) {
              return emitter.emit('error', err)
            }
            emitter.emit('created')
          })
        } else {
          emitter.emit('file', file)
        }
      })

      emitter.on('error', err => reject(err))

      emitter.on('created', () => {
        resolve(null)        
      })

      emitter.on('file', file => {
        const cache = parseCache(file)
        resolve(cache)
      })
    })
  },

  setCache: (cache) => {
    fs.writeFileSync(cacheFilePath, cache)
  },

  parseDict: () => {
    console.log(dictFile)
    fs.readFileSync(dictFile)
  }
}

function parseCache (file) {
  if (!file.length) {
    return null
  } 
  return file
}