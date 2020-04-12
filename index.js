const api = require('./src/api/api')
const user = {
  email: 'sanyasavva@yandex.ru',
  password: 'w_McNQ'
}

async function run () {
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
}


run()