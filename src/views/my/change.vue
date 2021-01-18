<template>
  <div class='smsMargin'>
    <div class='loginInput regInput changeInput'>
      <div class='changeDiv'>
        储蓄卡号
      </div>
      <input type="number" placeholder='请输入储蓄卡号' v-model='bankCard' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')" />
    </div>
    <div class='loginInput regInput changeInput'>
      <div class='changeDiv'>
        所属银行
      </div>
      <input type="text" v-model='value' readonly placeholder='所属银行' />
    </div>
    <div class='loginInput regInput changeInput'>
        <div class='changeDiv'>
            持卡人姓名
        </div>
        <input type="text" v-model='name' readonly placeholder='请输入持卡人姓名' />
    </div>
    <div class='loginInput regInput changeInput'>
        <div class='changeDiv'>
            预留手机号
        </div>
        <input type="number" v-model='phone' readonly oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')" placeholder='请输入预留手机号' />
    </div>
    <div  class='loginTo'>
      <div class='blue' @click='card()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        确认
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      bankCard: '',
      name: '',
      phone: '',
      fullscreenLoading: false,
      options: [{
        value: '北京银行',
        label: '北京银行'
      },
      {
        value: '光大银行',
        label: '光大银行'
      },
      {
        value: '广发银行',
        label: '广发银行'
      },
      {
        value: '建设银行',
        label: '建设银行'
      },
      {
        value: '交通银行',
        label: '交通银行'
      },
      {
        value: '民生银行',
        label: '民生银行'
      },
      {
        value: '农业银行',
        label: '农业银行'
      },
      {
        value: '平安银行',
        label: '平安银行'
      },
      {
        value: '兴业银行',
        label: '兴业银行'
      },
      {
        value: '浦发银行',
        label: '浦发银行'
      },
      {
        value: '邮政储蓄银行',
        label: '邮政储蓄银行'
      },
      {
        value: '招商银行',
        label: '招商银行'
      },
      {
        value: '中国工商银行',
        label: '中国工商银行'
      },
      {
        value: '中国银行',
        label: '中国银行'
      },
      {
        value: '中信银行',
        label: '中信银行'
      },
      {
        value: '上海银行',
        label: '上海银行'
      },
      {
        value: '华夏银行',
        label: '华夏银行'
      }],
      value: '',
      cardhead: []
    }
  },
  watch: {
    bankCard (n, o) {
      if (this.bankCard.length >= 13 && this.bankCard.length <= 19) {
        this.cardName()
      }
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.name = JSON.parse(this.$stact.state.token)[0].merchantCnName
    this.phone = JSON.parse(this.$stact.state.token)[0].phone
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    card () {
      let vm = this
      if (this.bankCard.match(/^[ ]*$/)) {
        this.$message({
          message: '储蓄卡号必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (this.value.match(/^[ ]*$/)) {
        this.$message({
          message: '请选择所属银行',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (this.name.match(/^[ ]*$/)) {
        this.$message({
          message: '姓名必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.phone.match(/^[ ]*$/)) {
        vm.$message({
          message: '手机号码必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (!(/^1[1-9]\d{9}$/.test(vm.phone))) {
        vm.$message({
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
        '3': '790005',
        '5': vm.bankCard,
        '6': vm.value,
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
              message: '储蓄卡修改成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
            vm.$router.go(-1)
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
          vm.fullscreenLoading = false
        })
    },
    cardName () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '690013',
        '15': vm.bankCard,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.cardhead = JSON.parse(res.data[16])
            vm.value = vm.cardhead.shortCnName
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
