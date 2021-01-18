<template>
  <div class="addpositionpay">
    <div class="pay-moneybox">
        <div class="paycount">
            <span>购买个数</span>
            <input type="number" min='1' step='100' placeholder="请输入购买个数" v-model="value" @input="getcount()" oninput="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')" onafterpaste="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')">
        </div>
        <div class="paycount">
            <span>应付金额</span>
            <span>{{paymoney}}元</span>
        </div>
    </div>
    <div class="pay-moneybox">
        <div class="paycount">
            <div class="selsct-pay">
                <div class="pay-type">
                    <img src="../../assets/member/zfb.png" alt="">
                </div>
                <div class="pay-name">
                    <div class="pay-method">支付宝</div>
                    <div class="method_content">安全快速支付</div>
                </div>
            </div>
            <div class="select-type">
                <el-radio v-model="radio" :label="YSZFBH5 == 1 ? 'YSZFBH5' : ZFBSM == 1 ? 'ZFBSM' : YSZFBSM == 1 ? 'YSZFBSM' : 'zfnone'"></el-radio>
            </div>
        </div>
        <div class="paycount">
            <div class="selsct-pay">
                <div class="pay-type">
                    <img src="../../assets/member/wx.png" alt="">
                </div>
                <div class="pay-name">
                    <div class="pay-method">微信</div>
                    <div class="method_content">安全快速支付</div>
                </div>
            </div>
            <div class="select-type">
                <el-radio v-model="radio" :label="YSWXH5 == 1 ? 'YSWXH5' : WXSM == 1 ? 'WXSM' : YSWXSM == 1 ? 'YSWXSM' : 'wxnone'"></el-radio>
            </div>
        </div>
    </div>
    <div class="next-btn" @click="next()" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        下一步
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: '', // 按钮选择
      value: '', // input输入的值
      paymoney: 0, // 付款的金额
      paytype: 'z', // 支付方式默认为z   w为微信
      kw: '',
      YSWXH5: 0,
      YSZFBH5: 0,
      WXSM: 0,
      ZFBSM: 0,
      YSWXSM: 0,
      YSZFBSM: 0,
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.kw = this.$stact.state.moAll.kw
    this.message()
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
    getcount () {
      let vm = this
      if (vm.value.length === 1) {
        vm.value = vm.value.replace(/[^1-9]/g, '')
      } else {
        vm.value = vm.value.replace(/\D/g, '')
      }
      if (Number(vm.value) > 100) {
        this.$message({
          message: '购买的卡位不能一次超过100个',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        vm.value = 100
        vm.paymoney = parseInt(vm.value * vm.kw * 100) / 100
        return
      }
      if (vm.value !== '') {
        vm.paymoney = parseInt(vm.value * vm.kw * 100) / 100
      } else {
        vm.paymoney = 0
      }
    },
    next () {
      let vm = this
      if (vm.value.match(/^[ ]*$/) || Number(vm.value) === 0) {
        this.$message({
          message: '请输入要买的个数',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
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
        '3': '190111', // 增加卡位的支付接口
        '8': vm.radio, // 支付方式 z支付宝   w微信
        '40': '', // 要升的等级，应该和卡位无关
        '5': vm.paymoney * 100, // 金额  传入的金额是“分”为单位
        '41': 'S',
        '42': vm.merchantNo,
        '43': vm.value, // 购买的数量
        '59': vm.version
      }
      vm.fullscreenLoading = true
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          this.fullscreenLoading = false
          if (res.data[39] === '00') {
            if (Number(this.YSWXH5) === 1) {
              window.location.href = res.data[57]
              return
            }
            if (Number(this.YSZFBH5) === 1) {
              document.write(res.data[57])
              return
            }
            vm.$router.push({ name: 'code', query: { code: res.data[57], logo: vm.radio, money: vm.paymoney } })
          } else {
            this.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2000,
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
          vm.fullscreenLoading = false
        })
    }
  }
}
</script>
