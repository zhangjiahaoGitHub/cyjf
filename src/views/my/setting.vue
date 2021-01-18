<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class="newbanben" @click="changepaw()">
      <span>修改密码</span>
      <span class="banben"><i class="el-icon-arrow-right"></i></span>
    </div>
    <!--<router-link tag="div" :to="{name: 'changetheme'}" class="newbanben no-martop">
      <span>更换主题</span>
      <span class="banben"><i class="el-icon-arrow-right"></i></span>
    </router-link>-->
    <div class="newbanben no-martop">
      <span>当前版本</span>
      <span class="banben">v1.0.1</span>
    </div>
    <div class='transferConfirm' style='margin-top: 1rem' @click='loginOut()'>
        安全退出
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
      merchant: {}
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchant = JSON.parse(this.$stact.state.token).merchant
  },
  methods: {
    loginOut () { // 退出 清除token
      let vm = this
      this.$confirm('是否确认退出？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        new Promise((resolve, reject) => {
          vm.$stact.dispatch('SetToken', '')
          vm.$stact.dispatch('SetReal', '')
          resolve()
        })
          .then(result => {
            vm.$router.push({ name: 'login' })
          })
          .catch(error => console.log(error))
      }).catch(() => {
      })
      window.name = ''
    },
    toNext (type) {
      let vm = this
      switch (type) {
        case 1:
          if (vm.passwd) {
            vm.$router.push({ name: 'modifyPass' })
          } else {
            vm.$router.push({ name: 'setPass' })
          }
          break
        case 2:
          vm.$router.push({ name: 'modifyPay' })
          break
        case 3:
          vm.$router.push({ name: 'modifyPhone' })
          break
        case 4:
          if (vm.nowStatus === '10D') {
            vm.$message({
              message: '待审核，请耐心等待',
              center: true,
              offset: 30,
              duration: 2000,
              type: 'warning'
            })
          } else if (vm.nowStatus === '10B') {
            vm.$message({
              message: '审核已通过请勿重复操作',
              center: true,
              offset: 30,
              duration: 2000,
              type: 'warning'
            })
          } else {
            vm.$router.push({ name: 'verified' })
          }
          break
        case 5:
          vm.$router.push({ name: 'forgetPay' })
          break
      }
    },
    changepaw () {
      this.$router.push({ name: 'changepaw' })
    }
  }
}
</script>
