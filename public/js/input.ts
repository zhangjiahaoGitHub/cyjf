export default {
  inputJs () :any {
    let ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i)) { // 为避免在微信浏览器出现点击出现底部空白问题
      for (let i = 0; i < document.querySelectorAll('input').length; i++) {
        console.log(document.querySelectorAll('input').length)
        document.querySelectorAll('input')[i].onblur = function () {
          setTimeout(() => {
            let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
            window.scrollTo(0, Math.max(scrollHeight - 1, 0))
          }, 100)
        }
      }
    }
  }
}
