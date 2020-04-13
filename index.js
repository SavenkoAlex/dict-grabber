const api = require('./src/api/api')
const helper = require('./src/utils/helper')

const user = {
  email: '',
  password: ''
}

async function run () {
  const words = helper.readDict()
  if (!words) {
    return
  }

  let cache = await helper.getCache()
  if (!cache) {
    const success = await api.login(user.email, user.password)
    if (success.error_code) {
      throw new Error(success)
    }
  }

  const it = function* requestSequence() {
    for (const word of words) yield api.getTranslations(word)
  }()
  
  for (let r of it) {
    console.log(await r)
  }

  /*
  for (const word of requests) {
    const translate = await api.getTranslations(word).catch(err => {
      console.error(err)
      continue
    })
    console.log(translate)
    translation.push(translate)
  }
  */
}


run()
