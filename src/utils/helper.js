const fs = require('fs')
const { EventEmitter } = require('events')
const path = require('path')
const emitter = new EventEmitter()

const cacheFilePath = 'cache'
const cwd = process.cwd()
const dictFilePatch = path.join(cwd, '/dict/dict')

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

  readDict: () => {
    const dict = fs.readFileSync(dictFilePatch)
    if (!Buffer.isBuffer(dict)) {
      console.error('dict is invalid')
      return null
    }
    const d1 = dict.toString('utf8')
    const arr = []
    let str = ''
    for (l of d1) {
      if (l === '\n' && str.length) {
        arr.push(str)
        str = ''
        continue
      }
      str+=l
    }
    return arr.length ? arr : null
  },

  getMostFamousTranslate (translate) {
    
  } 
}

function parseCache (file) {
  if (!file.length) {
    return null
  } 
  return file
}
