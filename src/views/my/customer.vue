<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='customerBorder'>
        <div class='customerPhone'>
            <img src='../../assets/my/telphone.png' />
        </div>
        <div class='phoneTitle'>
            <span>
                电话客服
            </span>
        </div>
        <div class='workTime'>
            工作时间：9:00-18:00（非国家法定节假日）
        </div>
        <div class='tellPhone'>
            <a class='truePhone' @click='tellPhone(list.phone)'>{{list.phone ? '立即联系' : '暂未开放'}}</a>
        </div>
    </div>
    <div class='customerBorder'>
        <div class='customerPhone'>
            <img src='../../assets/my/online.png' />
        </div>
        <div class='phoneTitle'>
            <span>
                在线客服
            </span>
        </div>
        <div class='workTime'>
            (处理软件操作、还款相关问题)
        </div>
        <div class='tellPhone'>
            <a class='truePhone' @click='toIframe(list.link)'>{{list.link ? '立即联系' : '暂未开放'}}</a>
        </div>
    </div>
    <div class='customerBorder'>
        <div class='customerPhone'>
            <img src='../../assets/my/wx.png' />
        </div>
        <div class='phoneTitle'>
            <span>
                微信客服
            </span>
        </div>
        <div class='workTime btn' :data-clipboard-text="list.wx"  @click='copyText()'>
            官方微信号：
            <span>{{list.wx ? list.wx : '暂未开放'}}</span>
        </div>
    </div>
    <div class='customerContent'>
      温馨提示：为了更加快速解答您的问题，建议优先点击“在线客服”，同时把您的注册手机号、姓名以及相关问题及时发送，谢谢！
    </div>
    <div class='bottomLong'>
    </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard'

export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      list: []
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.getList()
  },
  methods: {
    tellPhone (phone) {
      let vm = this
      if (phone.match(/^[ ]*$/)) {
        vm.$message({
          message: '暂未开放',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      window.location.href = 'tel://' + phone
      if (isAndroid) {
        window.android.call(phone)
      }
      if (isiOS) {
        window.webkit.messageHandlers.interaction.postMessage(phone)
      }
    },
    copyText () {
      let vm = this
      let clipboard = new Clipboard('.btn')
      clipboard.on('success', (e) => {
        vm.$message({
          message: '复制成功',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        vm.$message({
          message: '复制失败',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        clipboard.destroy()
      })
    },
    getList () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.list = JSON.parse(res.data[5])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    toIframe (url) {
      let vm = this
      if (url.match(/^[ ]*$/)) {
        vm.$message({
          message: '暂未开放',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      this.$router.push({ name: 'ifarme', query: { url: url, title: '在线客服' } })
    }
  }
}
</script>
