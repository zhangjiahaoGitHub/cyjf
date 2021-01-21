<template>
  <div class='hundred blueHun'>
    <div style='height:1px'></div>
    <div class='codeBack'>
        <div class='codeTitle' v-if="$route.query.logo === 'z'">
            <img src='../../assets/member/zfb.png' class='codeLogo'>支付宝
        </div>
        <div class='codeTitle' v-else>
            <img src='../../assets/member/wx.png' class='codeLogo'>微信
        </div>
        <div id='qrcode'></div>
        <div class='codePo'>注： 请在10分钟内扫码支付</div>
    </div>
  </div>
</template>

<script>
import QRcode from 'qrcodejs2'

export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      code: ''
    }
  },
  components: {
  },
  watch: {
  },
  beforeCreate () {
  },
  created () {
    this.code = this.$route.query.code
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
  },
  mounted () {
    this.qrcode()
  },
  methods: {
    qrcode () {
      let vm = this
      let qrcode = new QRcode('qrcode', {
        width: 300,
        height: 300, // 高度
        text: 'http://chuangyijinfu.llyzf.cn:80//lly-posp-proxy/payView.app?m=' + vm.code // 二维码内容
      })
      console.log(qrcode)
    }
  }
}
</script>
