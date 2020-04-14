const api = require('./src/api/api')
const helper = require('./src/utils/helper')
const { EventEmitter } = require('events')
const emitter = new EventEmitter()

const config = {
  email: '',
  password: '',
  addParams: {
    apiVersion: '1.0.1',
    ctx: {
      config: {
        isCheckData :true,
        isLogging :true
      }
    },
    data: [],
    op: 'actionWithWords {action: add}',
    userData: {
      nativeLanguage: 'lang_id_src'
    }
  },
  dictId: 41
}

async function run () {
  const words = helper.readDict()
  if (!words) {
    return
  }
  let counter = 0
  const total = words.length
  let cache = await helper.getCache()
  if (!cache) {
    const success = await api.login(user.email, user.password)
    if (success.error_code) {
      throw new Error(success)
    }
  }

  const it = async function* requestSequence() {
    for (const word of words) {
      yield await api.getTranslations(word)
    }
  }()
 
  const ex = setInterval(async () => {
    const translate = await  it.next()
    if (translate.done) {
      emitter.emit('done')
    }

    const choosedTranslating = helper.getMostFamousTranslate(translate.value)
    choosedTranslating.valueList.wordSetId = config.dictId
    const params = { ...config.addParams }
    params.data[0] = choosedTranslating
    api.setWord(params).then(res => {
      console.log(counter + '/' + total)
      ++counter
    }).catch(err => {
      console.error(err)
    })
  }, 2000)
  
  emitter.on('done', () => {
    clearInterval(ex)
  })
}


run()
