<template>
  <div class='balanceHight'>
    <div class='peopleTitle'>
      <input type='text' class='peopleInput reatInput' v-model='money' @input='IsMoney()' placeholder='请输入提现金额' />
    </div>
    <div class='retreatRemarks'>注：{{topMoney}}以上起提，手续费{{shou}}，提现至您的账号</div>
    <div class='allFlex paddProfit justifyBetween'>
      <div class='gary'>
        到账卡：<span class='black'>{{bankName}}({{bankCard}})</span>
      </div>
      <router-link :to="{name: 'change'}" tag="div" class='blueColor textRight textPadding'>
        更换储蓄卡
        <img src='../../assets/blueRight.png' class='rightNext'/>
      </router-link >
    </div>
    <div class='transferConfirm' @click='getMoney()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        确认提现
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      phone: '',
      version: '',
      agentNo: '',
      merchantNo: '',
      money: '',
      bankName: '',
      bankCard: '',
      bankCode: 0,
      banks: {
        313003: 'bj',
        303: 'gd',
        306: 'gf',
        105: 'js',
        301: 'jt',
        305: 'ms',
        103: 'ny',
        307: 'pa',
        309: 'xy',
        310: 'pf',
        403: 'yz',
        308: 'zs',
        102: 'gs',
        104: 'zg',
        302: 'zx',
        313062: 'sh',
        304: 'hx'
      },
      fullscreenLoading: false,
      topMoney: 0,
      shou: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.message()
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    IsMoney () { // 限制
      let vm = this
      let value = vm.money
      value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      if (value.indexOf('.') < 0 && value !== '') { // 以上已经过滤,此处控制的是如果没有小数点,首位不能为类似于 01、02的金额
        value = parseFloat(value)
      }
      vm.money = value.toString()
    },
    message () {
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
            vm.$stact.dispatch('SetToken', res.data[57]) // 存token
            vm.bankName = JSON.parse(this.$stact.state.token)[0].bankDetail
            vm.bankCard = JSON.parse(this.$stact.state.token)[0].bankAccount
            vm.bankCard = vm.bankCard.substring(vm.bankCard.length - 4, vm.bankCard.length)
            vm.bankCode = JSON.parse(this.$stact.state.token)[0].bankCode
            vm.topMoney = res.data[9]
            vm.shou = res.data[8]
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMoney () {
      let vm = this
      if (vm.money.match(/^[ ]*$/)) {
        vm.$message({
          message: '金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (!vm.money.match(/(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/)) {
        vm.$message({
          message: '金额请输入正确格式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.bankCard.match(/^[ ]*$/)) {
        vm.$message({
          message: '银行卡为空，请先实名认证',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (Number(vm.money) < Number(vm.topMoney)) {
        vm.$message({
          message: `${vm.topMoney}以上起提`,
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      let parmas = {
        '0': '0700',
        '3': '190888',
        '5': vm.money,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '提现成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
            vm.$router.push({ name: 'my' })
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
          vm.fullscreenLoading = false
          console.log(err)
        })
    }
  }
}
</script>
