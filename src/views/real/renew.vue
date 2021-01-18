<template>
  <div class="hundred">
    <div style='height:1px'></div>
    <div class="bg-gray whiteBack">
        <span>姓名</span><input type="text" placeholder="请输入姓名" v-model="name">
    </div>
    <div class="bg-gray whiteBack">
        <span>身份证</span><input type="text" placeholder="请输入身份证" v-model="idcard">
    </div>
    <div class="bg-gray whiteBack">
        <span>手机号</span><input type="text" placeholder="请输入手机号" v-model="phone">
    </div>
    <div class="bg-gray whiteBack">
        <span>储蓄卡号</span><input type="text" placeholder="请输入储蓄卡号" v-model="cardNum">
    </div>
    <div class="bg-gray whiteBack">
        <span>银行名称</span><input type="text" placeholder="请输入银行名称" v-model="bankName" readonly>
    </div>
    <div  class='loginTo'>
      <div class='blue' @click='confirm()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        下一步
      </div>
    </div>
    <div class='bottomLong'></div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      cardNum: '', // 银行卡卡号
      name: '', // 姓名
      identity: '',
      cvn: '',
      expiration: '',
      phone: '', // 手机号
      fullscreenLoading: false,
      card: [],
      idcard: '', // 身份证号
      time: 0,
      aisle: 0,
      category: 0,
      merchantId: '',
      money: '',
      billDay: '',
      repDay: '',
      cardhead: '',
      bankName: '', // 银行名称
      bankmessage: '',
      bankCode: '', // 银行code
      item: {}
    }
  },
  watch: {
    cardNum (n, o) {
      if (this.cardNum.length >= 13 && this.cardNum.length <= 19) {
        this.cardName()
      }
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.item = JSON.parse(this.$route.query.item)
    this.name = this.item.merchantCnName
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.phone = this.item.phone
    this.idcard = this.item.idCardNumber
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    confirm () {
      let vm = this
      if (this.name.match(/^[ ]*$/)) {
        this.$message({
          message: '姓名必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.idcard.match(/^[ ]*$/)) {
        this.$message({
          message: '您的身份证号必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (!regIdNo.test(vm.idcard)) {
        this.$message({
          message: '您的身份证号填写有误',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      // 手机号码
      if (this.phone.match(/^[ ]*$/)) {
        this.$message({
          message: '手机号码必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (!(/^1[1-9]\d{9}$/.test(this.phone))) {
        this.$message({
          message: '手机号码有误，请重填',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      // 银行卡卡号
      if (this.cardNum.match(/^[ ]*$/)) {
        this.$message({
          message: '请输入银行卡卡号',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      // 银行名称
      if (this.bankName.match(/^[ ]*$/)) {
        this.$message({
          message: '银行名称必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      let parmas = {
        '0': '0700', // 必须
        '1': vm.phone, // 手机号
        '3': '390011', // 接口
        '8': vm.idcard, // 身份证号
        '10': vm.name, // 姓名
        '11': vm.cardNum, // 银行卡号
        '12': vm.bankName, // 银行名称
        '13': vm.bankCode, // 银行code
        '42': vm.merchantNo, // 商户编号
        '43': vm.item.merchantNo,
        '59': vm.version
      }
      vm.fullscreenLoading = true
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$router.push({ name: 'adduserreal', query: { merchantNo: vm.item.merchantNo } })
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
    },
    cardName () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '690013',
        '15': vm.cardNum,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.bankmessage = JSON.parse(res.data[16])
            vm.bankName = vm.bankmessage.shortCnName
            vm.bankCode = vm.bankmessage.bankCode
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
