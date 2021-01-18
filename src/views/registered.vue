<template>
  <div class='smsMargin'>
    <div class='loginInput'>
      <div>
        <img src='../assets/phone.png' />
      </div>
      <input type="text" placeholder='请输入您的手机号码' v-model='phone' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput'>
      <div>
        <img src='../assets/codesend.png' />
      </div>
      <input type="number" class='smsInput' placeholder='请输入验证码' v-model='code' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
      <div class='smsCode'>
        <span @click="time <= 0 ? getCode() : ''" class='smsBorder'>
          {{text}}
        </span>
      </div>
    </div>
    <div class='loginInput'>
      <div>
        <img src='../assets/password.png' />
      </div>
      <input type="password" placeholder='请输入新密码' v-model='password' />
    </div>
    <div class='loginInput'>
      <div>
        <img src='../assets/password.png' />
      </div>
      <input type="password" placeholder='请再次输入新密码' v-model='newPassword' />
    </div>
    <div class='loginInput'>
      <div>
        <img src='../assets/people.png' />
      </div>
      <input type="passnumberword" :placeholder="topTure === '1'?'请填写邀请人手机号':'请填写邀请人手机号'" v-model='invite' :readonly='$route.query.invite?true:false' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div  class='loginTo'>
      <div class='blue' @click='registered()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading' >
        立即注册
      </div>
    </div>
    <div class='textCenter regtpbx' v-if='down === 1'>
      <span>APP下载</span>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      time: 0,
      text: '获取验证码',
      version: '',
      agentNo: '',
      phone: '',
      code: '',
      password: '',
      newPassword: '',
      invite: '',
      fullscreenLoading: false,
      topTure: 0,
      down: 0
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    if (this.$route.query.invite) {
      this.invite = this.$route.query.invite
    } else {
      this.invite = ''
    }
    this.isTop()
  },
  watch: {
    phone (n, o) {
      if (this.phone.length === 11) {
        this.downPhone()
      } else {
        this.down = 0
      }
    }
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    downPhone () {
      let vm = this
      let parmas = {
        '0': '0700',
        '1': vm.phone,
        '3': '790014',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.down = 1
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    isTop () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190917',
        '44': vm.agentNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.topTure = res.data[57]
          }
        })
        .catch(err => {
          console.log(err)
        })
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
        '1': vm.phone,
        '3': '190919',
        '5': '2',
        '44': vm.agentNo,
        '52': vm.code,
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
              duration: 2500,
              type: 'success'
            })
            vm.sendMail()
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
    registered () { // 注册
      let vm = this
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
      if (this.code.match(/^[ ]*$/)) {
        this.$message({
          message: '验证码必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.code.length !== 6) {
        this.$message({
          message: '验证码不正确',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.password.match(/^[ ]*$/)) {
        this.$message({
          message: '密码必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.password.length < 6 || vm.password.length > 14) {
        this.$message({
          message: '密码长度限制为6-14位',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (this.newPassword.match(/^[ ]*$/)) {
        this.$message({
          message: '确认新密码必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.password !== this.newPassword) {
        this.$message({
          message: '新密码和确认密码不一致',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (vm.topTure === '1') {
        if (this.invite.match(/^[ ]*$/)) {
          this.$message({
            message: '邀请人手机号码必须填写',
            center: true,
            offset: 30,
            duration: 2000,
            type: 'warning'
          })
          return
        }
      }
      if (!(/^1[1-9]\d{9}$/.test(this.invite)) && this.invite) {
        this.$message({
          message: '邀请人手机号码有误，请重填',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      let parmas = {
        '0': '0700',
        '1': vm.phone,
        '3': '190918',
        '8': vm.$md5(vm.password),
        '44': vm.agentNo,
        '45': vm.invite,
        '52': vm.code,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            this.$message({
              message: '注册成功',
              center: true,
              offset: 30,
              duration: 2000,
              type: 'success'
            })
            vm.$router.push({ name: 'login' })
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
    }
  }
}
</script>
