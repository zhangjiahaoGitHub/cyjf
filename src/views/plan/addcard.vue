<template>
  <div>
    <div style='height:1px'></div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="text" placeholder='请输入本人信用卡卡号' v-model='cardNum' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="text" placeholder='请输入姓名' v-model='name' readonly/>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="text" placeholder='请输入身份证号码' v-model='identity' readonly oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='widthMatter allFlex matterAuto justifyBetween border marginMatter'>
        <div class='addcardDiv'>
          <i @click="popClick('yxq')" class="el-icon-info addcardI"></i>
          <input type="text" class='matterCentent' placeholder='有效期(如:0525)' v-model='expiration' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
        </div>
        <div>
          <input type="text" class='matterCentent' placeholder='输入信用卡额度' v-model='money' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
        </div>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="text" placeholder='银行卡名称(自动获取)' v-model='bankName' readonly/>
    </div>
    <div class='widthMatter allFlex matterAuto justifyBetween border marginMatter'>
        <div>
          <input type="text" class='matterCentent' placeholder='输入账单日期(如:5)' v-model='billDay' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
        </div>
        <div>
          <input type="text" class='matterCentent' placeholder='输入还款日期(如:25)' v-model='repDay' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
        </div>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter addcardDiv'>
        <i @click="popClick('cvv')" class="el-icon-info addcardI"></i>
        <input type="text" placeholder='输入CVV码（卡背后最后3位数字）' v-model='cvn' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput widthMatter regInput border marginMatter'>
        <input type="text" placeholder='输入预留手机号码' v-model='phone' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div  class='loginTo'>
      <div class='blue' @click='confirm()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        确认认证
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
      time: 0,
      aisle: 0,
      category: 0,
      merchantId: '',
      money: '',
      billDay: '',
      repDay: '',
      cardhead: '',
      bankName: '',
      item: '',
      usermerchantNo: ''
    }
  },
  watch: {
    cardNum (n, o) {
      console.log(n)
      console.log(o)
      if (this.cardNum.length >= 13 && this.cardNum.length <= 19) {
        this.cardName()
      }
    }
  },
  created () {
    if (this.$route.query.item) {
      this.item = JSON.parse(this.$route.query.item)
    }
    this.usermerchantNo = this.$route.query.merchantNo
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.first()
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    popClick (type) {
      this.popShow = true
      this.imageType = type
    },
    first () {
      if (this.item) {
        this.merchantNo = this.usermerchantNo
        this.merchantId = this.item.id
        this.identity = this.item.idCardNumber
        this.name = this.item.merchantCnName
        this.phone = this.item.phone
      } else {
        this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
        this.merchantId = JSON.parse(this.$stact.state.token)[0].id
        this.identity = JSON.parse(this.$stact.state.token)[0].idCardNumber
        this.name = JSON.parse(this.$stact.state.token)[0].merchantCnName
        this.phone = JSON.parse(this.$stact.state.token)[0].phone
      }
    },
    confirm () {
      let vm = this
      if (this.cardNum.match(/^[ ]*$/)) {
        this.$message({
          message: '请输入信用卡卡号',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
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
      if (this.identity.match(/^[ ]*$/)) {
        this.$message({
          message: '请先实名',
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
      if (this.money.match(/^[ ]*$/)) {
        this.$message({
          message: '请输入信用卡额度',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
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
      if (this.billDay.match(/^[ ]*$/)) {
        this.$message({
          message: '请输入账单日期',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (Number(this.billDay) < 1 || Number(this.billDay) > 31) {
        this.$message({
          message: '账单日期1~31号',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.repDay.match(/^[ ]*$/)) {
        this.$message({
          message: '请输入还款日期',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (Number(this.repDay) < 1 || Number(this.repDay) > 31) {
        this.$message({
          message: '还款日期1~31号',
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
      let parmas = {
        '0': '0700',
        '3': '490018',
        '5': vm.money,
        '6': vm.billDay,
        '7': vm.repDay,
        '37': 0,
        '42': vm.identity,
        '43': vm.merchantId,
        '45': vm.cardNum,
        '46': vm.phone,
        '47': vm.expiration,
        '48': vm.cvn,
        '49': 'A',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '绑卡成功',
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
            vm.bankName = JSON.parse(res.data[16]).shortCnName
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
