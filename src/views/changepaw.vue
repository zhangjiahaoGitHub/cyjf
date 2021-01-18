<template>
  <div class='smsMargin'>
    <div class='loginInput'>
      <div>
        <img src='../assets/password.png' />
      </div>
      <input type="password" placeholder='请输入原密码' v-model='oldpassword' />
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
    <div  class='loginTo'>
      <div class='blue' @click='forget()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        确认
      </div>
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
      oldpassword: '',
      password: '',
      newPassword: '',
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.phone = JSON.parse(this.$stact.state.token)[0].phone
    console.log(this.phone)
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    forget () { // 注册
      let vm = this
      if (this.oldpassword.match(/^[ ]*$/)) {
        this.$message({
          message: '旧密码必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.password.match(/^[ ]*$/)) {
        this.$message({
          message: '新密码必须填写',
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
      let parmas = {
        '0': '0700',
        '1': vm.phone,
        '3': '790011',
        '8': vm.$md5(vm.oldpassword), // 旧密码
        '9': vm.$md5(vm.password),
        '10': vm.$md5(vm.newPassword),
        '44': vm.agentNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '修改成功',
              center: true,
              offset: 30,
              duration: 2000,
              type: 'success'
            })
            localStorage.clear()
            vm.$router.push({ name: 'login' })
            location.reload()
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
          console.log(err)
          vm.fullscreenLoading = false
        })
    }
  }
}
</script>
