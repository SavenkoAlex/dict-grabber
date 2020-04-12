const api = require('./src/api/api')
const helper = require('./src/utils/helper')

const user = {
  email: 'sanyasavva@yandex.ru',
  password: 'w_McNQ'
}

async function run () {
  let cache = await helper.getCache()
  if (!cache) {
    const success = await api.login(user.email, user.password)
    if (success.error_code) {
      throw new Error(success)
    }
  }
   
  /*  
  const loginStatus = await api.login(user.email, user.password)
  if (loginStatus.error_code) {
    console.error(loginStatus)
    return
  } 
  const translation = await api.getTranslations('boy').catch(err => {
    console.error(err)
    return
  })
  console.log(translation)
  */
}


run()