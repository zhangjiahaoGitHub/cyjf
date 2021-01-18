<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='allFlex setInput wihitSet collectionPadd'>
        <div class='setName'>
            到账银行
        </div>
        <div class='setRightLong textLeft'>
            <img :src="banks[bankCode]?require(`../../assets/bank/${banks[bankCode]}.png`):require('../../assets/bank/yl.png')" class='bankLogo' /><span class='bankRight'>{{bankName}}</span> 尾号{{bankCard}}
        </div>
    </div>
    <div class='gray collection'>收款金额</div>
    <div class='peopleTitle'>
      <input type='text' class='peopleInput reatInput collectionInput' v-model='money' @input='IsMoney()' placeholder='请输入收款金额' />
    </div>
    <div class='retreatRemarks whiteBack collectionRemarks'>
      收款时间：10:00 - 22:00
    </div>
    <div class='whiteBack collectionTop'>
        <div class='transferConfirm' @click='getMoney()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
            确认提现
        </div>
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
      fullscreenLoading: false
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
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMoney () {
      let vm = this
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
