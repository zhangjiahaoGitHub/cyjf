<template>
  <div class='hundred'>
    <div class='payMoney'>
        <span>￥</span>{{money}}
    </div>
    <div class='allFlex paySelect'>
        <img src='../../assets/member/zfb.png' >
        <div class='payName'>
            <p>支付宝</p>
            <p>安全快速支付</p>
        </div>
        <el-radio v-model="radio" :label="YSZFBH5 == 1 ? 'YSZFBH5' : ZFBSM == 1 ? 'ZFBSM' : YSZFBSM == 1 ? 'YSZFBSM' : 'zfnone'"></el-radio>
    </div>
    <div class='allFlex paySelect'>
        <img src='../../assets/member/wx.png' >
        <div class='payName'>
            <p>微信</p>
            <p>安全快速支付</p>
        </div>
        <el-radio v-model="radio" :label="YSWXH5 == 1 ? 'YSWXH5' : WXSM == 1 ? 'WXSM' : YSWXSM == 1 ? 'YSWXSM' : 'wxnone'"></el-radio>
    </div>
    <div class='loginTo longMargin'>
      <div class='blue' @click='pay()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        立即充值
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: '',
      money: '',
      version: '',
      agentNo: '',
      merchantNo: '',
      tozfb: '',
      YSWXH5: 0,
      YSZFBH5: 0,
      WXSM: 0,
      ZFBSM: 0,
      YSWXSM: 0,
      YSZFBSM: 0,
      fullscreenLoading: false,
      level: 0
    }
  },
  components: {
  },
  watch: {
  },
  beforeCreate () {
  },
  created () {
    this.money = this.$route.query.money
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.level = this.$route.query.level
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.message()
  },
  mounted () {
  },
  methods: {
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      vm.fullscreenLoading = true
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            console.log(res)
            this.YSWXH5 = JSON.parse(res.data[10]).YSWXH5
            this.YSZFBH5 = JSON.parse(res.data[10]).YSZFBH5
            this.WXSM = JSON.parse(res.data[10]).WXSM
            this.ZFBSM = JSON.parse(res.data[10]).ZFBSM
            this.YSWXSM = JSON.parse(res.data[10]).YSWXSM
            this.YSZFBSM = JSON.parse(res.data[10]).YSZFBSM
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    pay () {
      let vm = this
      if (vm.radio.match(/^[ ]*$/)) {
        vm.$message({
          message: '请选择支付方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.radio === 'zfnone') {
        vm.$message({
          message: '暂无支付宝支付方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.radio === 'wxnone') {
        vm.$message({
          message: '暂无微信支付方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      let parmas = {
        '0': '0700',
        '3': '190111',
        '5': this.money * 100,
        '8': vm.radio,
        '40': vm.level,
        '41': 'M',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            if (Number(this.YSWXH5) === 1) {
              window.location.href = res.data[57]
              return
            }
            if (Number(this.YSZFBH5) === 1) {
              document.write(res.data[57])
              return
            }
            vm.$router.push({ name: 'code', query: { code: res.data[57], logo: vm.radio, money: this.$route.query.money } })
          } else {
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
