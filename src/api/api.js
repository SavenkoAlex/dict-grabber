const { request } = require('https')

const config = {
  api: 'api.lingualeo.com',
  url: 'lingualeo.com',

  // API paths
  getTranslations: '/gettranslates',
  addWordToDictionary: '/addword',
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
          config.cookie = response.headers ? response.headers['set-cookie'] : null
        }
      })
      
      req.end()
    })    
  },

  getTranslations: word => {
    return new Promise((resolve, reject) => {
      if (!config.cookie) {
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
          'Cookie': config.cookie
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