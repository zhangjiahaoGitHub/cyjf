const md5 = require('md5')
export default {
  mdGet (obj : any) :any {
    let mdGet = ''
    for (let key in obj) {
      mdGet += obj[key]
    }
    mdGet = md5(mdGet + '21E4ACD4CD5D4619B063F40C5A454F7D')
    obj['64'] = mdGet
    return obj
  }
}
