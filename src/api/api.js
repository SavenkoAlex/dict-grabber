const { request } = require('https')
const { setCache, getCache } = require('../utils/helper')

const config = {
  api: 'api.lingualeo.com',
  url: 'lingualeo.com',

  // API paths
  getTranslations: '/gettranslates',
  addWordToDictionary: '/SetWords', //'/addword',
  translateFromRussian: '/translate.php',
  cookie: null,

  // Site paths
  openWordInDictionary: '/glossary/learn/internet?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=simplifiedcontent#'
}

module.exports = {
  login: (e, p) => {
    // p = 'asdasd'
    const options = {
      hostname: config.api,
      path: `/login?email=${e}&password=${p}`,
      method: 'GET',
    }

    return new Promise ((resolve, reject) => {
      const req = request(options, response => {
        response.setEncoding('utf8')
        response.on('data', data => {
          resolve(data)
        })        
      })
      
      req.on('error', err => {
        console.error(err)
        reject(err)
      })

      req.on('response', response => {
        if (response.headers) {
          setCache(response.headers['set-cookie'])
        }
      })
      
      req.end()
    })    
  },

  getTranslations: word => {
    return new Promise( async (resolve, reject) => {
      const cookie = await getCache()
      if (!cookie) {
        reject('can\'t find cookies try run login method first')
      }
      const body = JSON.stringify({
        word: word,
        include_media: 1,
        app_word_forms: 1
      })
      const options = {
        hostname: config.api,
        path: config.getTranslations,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
          'Cookie': cookie
        }
      }

      const req = request(options, response => {
        response.setEncoding('utf8')
        response.on('data', data => {
          resolve(data)
        })
      })
      req.write(body)
      req.end()
    })
  },
  setWord: async function (params) {
    return new Promise( async (resolve, reject) => {
      const cookie = await getCache()
      if (!cookie) {
        reject('can\'t find cookies try run login method first')
      }
      const body = JSON.stringify(params)
      const options = {
        hostname: config.api,
        path: config.addWordToDictionary,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
          'Cookie': cookie
        }
      }

      const req = request(options, response => {
        response.setEncoding('utf8')
        response.on('data', data => {
          resolve(data)
        })
      })
      req.write(body)
      req.end()
    })
  }
}
