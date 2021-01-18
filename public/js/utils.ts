const utils = {
  /**
  * 对象转url参数
  * @param {*} data
  * @param {*} isPrefix
  */
  queryParams (data: any, isPrefix: boolean = true) {
    let prefix = isPrefix ? '?' : ''
    let _result = []
    for (let key in data) {
      let value = data[key]
      // 去掉为空的参数
      if (['', undefined, null].includes(value)) {
        continue
      }
      if (value.constructor === Array) {
        value.forEach((_value: any) => {
          _result.push(decodeURIComponent(key) + '[]=' + decodeURIComponent(_value))
        })
      } else {
        _result.push(decodeURIComponent(key) + '=' + decodeURIComponent(value))
      }
    }
    return _result.length ? prefix + _result.join('&') : ''
  }
  // ....其他函数....
}
export default utils
