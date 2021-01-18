<template>
  <div>
    <div style='height:1px'></div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="number" placeholder='请输入本人信用卡卡号' v-model='cardNum' readonly oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="text" placeholder='请输入姓名' v-model='name' readonly/>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="text" placeholder='请输入身份证号码' v-model='identity' readonly oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="number" placeholder='请输入有效期(如:0525)' v-model='expiration' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter addcardDiv'>
        <i @click="popClick('cvv')" class="el-icon-info addcardI"></i>
        <input type="number" placeholder='输入CVV码（卡背后最后3位数字）' v-model='cvn' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="number" placeholder='输入预留手机号码' v-model='phone' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput widthMatter border regInput' v-if='category === 1'>
      <input type="number" class='smsInput' placeholder='请输入验证码' v-model='code' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
      <div class='smsCode'>
        <span @click="time <= 0 ? getCode() : ''" class='smsBorder'>
          {{text}}
        </span>
      </div>
    </div>
    <div  class='loginTo'>
      <div class='blue' @click='confirm()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        确认
      </div>
    </div>
    <div class='bottomLong'></div>
    <div @click="()=>{this.popShow = false}" v-if="popShow" class="addcard-popDiv">
      <img @click.stop="" :src="require(`../../assets/${imageType}.png`)" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      popShow: false,
      imageType: '',
      version: '',
      agentNo: '',
      merchantNo: '',
      cardNum: '',
      name: '',
      identity: '',
      cvn: '',
      expiration: '',
      phone: '',
      fullscreenLoading: false,
      card: [],
      text: '获取验证码',
      code: '',
      time: 0,
      aisle: 0,
      category: 0,
      merchantId: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.merchantId = JSON.parse(this.$stact.state.token)[0].id
    this.card = JSON.parse(this.$route.query.item)
    this.cardNum = this.card.BANK_ACCOUNT
    this.name = this.card.BANK_ACCOUNT_NAME
    this.identity = this.card.ID_CARD_NUMBER.toString()
    this.cvn = this.card.CVN
    this.expiration = this.card.EXPDATE
    this.phone = this.card.BANK_PHONE
    this.aisle = this.$route.query.code
    this.category = Number(this.$route.query.category)
    if (this.$route.query.merchantNo) {
      this.merchantNo = this.$route.query.merchantNo
      this.merchantId = this.$route.query.merchantId
    }
    console.log(this.card)
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    popClick (type) {
      this.popShow = true
      this.imageType = type
    },
    getCode () { // 获取验证码
      let vm = this
      if (this.phone.match(/^[ ]*$/)) {
        this.$message({
          message: '手机号码必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (!(/^1[1-9]\d{9}$/.test(this.phone))) {
        this.$message({
          message: '手机号码有误，请重填',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      let parmas = {
        '0': '0700',
        '3': '490018',
        '5': vm.card.LIMIT_MONEY,
        '6': vm.card.BILL_DAY,
        '7': vm.card.REPAYMENT_DAY,
        '31': 0,
        '37': vm.card.bankId,
        '42': vm.identity,
        '43': vm.merchantId,
        '45': vm.cardNum,
        '46': vm.phone,
        '47': vm.expiration,
        '48': vm.cvn,
        '49': vm.aisle,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '发送成功',
              center: true,
              offset: 30,
              duration: 2000,
              type: 'success'
            })
            vm.sendMail()
          } else {
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2000,
              type: 'success'
            })
            if (res.data[39] === '签约成功,重复签约') {
              vm.$router.go(-1)
              return
            }
            if (res.data[39] === '签约成功，重复签约') {
              vm.$router.go(-1)
            }
          }
        })
        .catch(err => {
          console.log(err)
          vm.fullscreenLoading = false
        })
    },
    sendMail () { // 倒计时
      this.time = 120
      this.timer()
    },
    timer () { // 倒计时中
      if (this.time > 0) {
        this.text = `${this.time--}后可重发`
        setTimeout(this.timer, 1000)
      } else {
        this.text = '重新获取'
      }
    },
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
      if (this.expiration.match(/^[ ]*$/)) {
        this.$message({
          message: '请输入有效期',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.expiration.length !== 4) {
        this.$message({
          message: '有效期，请输入4位',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.cvn.match(/^[ ]*$/)) {
        this.$message({
          message: '输入CVV码',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.cvn.length !== 3) {
        this.$message({
          message: 'CVV，请输入3位',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
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
      if (this.code.match(/^[ ]*$/) && this.category === 1) {
        this.$message({
          message: '验证码必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.code.length !== 6 && this.category === 1) {
        this.$message({
          message: '验证码不正确',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.category === 1) {
        vm.channer()
      }
      if (this.category === 0) {
        vm.nochan()
      }
    },
    nochan () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '490008',
        '5': vm.card.LIMIT_MONEY,
        '6': vm.card.BILL_DAY,
        '7': vm.card.REPAYMENT_DAY,
        '31': 0,
        '37': vm.card.bankId,
        '42': vm.identity,
        '43': vm.merchantId,
        '45': vm.cardNum,
        '46': vm.phone,
        '47': vm.expiration,
        '48': vm.cvn,
        '49': vm.aisle,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '绑卡',
              center: true,
              offset: 30,
              duration: 2000,
              type: 'success'
            })
            vm.$router.push({ name: 'ifarme', query: { url: res.data[38], title: '通道绑卡' } })
          } else {
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2000,
              type: 'success'
            })
            if (res.data[39] === '签约成功,重复签约') {
              vm.$router.go(-1)
              return
            }
            if (res.data[39] === '签约成功，重复签约') {
              vm.$router.go(-1)
            }
          }
        })
        .catch(err => {
          console.log(err)
          vm.fullscreenLoading = false
        })
    },
    channer () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '490007',
        '6': vm.card.BILL_DAY,
        '7': vm.card.REPAYMENT_DAY,
        '41': vm.cardNum,
        '42': vm.code,
        '46': vm.phone,
        '49': vm.aisle,
        '50': vm.merchantId,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '绑定成功',
              center: true,
              offset: 30,
              duration: 2000,
              type: 'success'
            })
            vm.$router.go(-1)
          } else {
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2000,
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
