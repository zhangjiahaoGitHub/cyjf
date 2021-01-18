<template>
  <div class='minHeight'>
    <div class='head headqi'>
        <img src='../assets/loginBack.png' />
    </div>
    <div class='loginInput'>
      <div>
        <img src='../assets/phone.png' />
      </div>
      <input type="text" placeholder='请输入手机号码' v-model='phone' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"/>
    </div>
    <div class='loginInput'>
      <div>
        <img src='../assets/password.png' />
      </div>
      <input type="password" placeholder='请输入密码' v-model='password'/>
    </div>
    <div class='allFlex widthFlex'>
      <div class='half'>
        <span>
          <!--<el-checkbox v-model="checked"></el-checkbox>
          记住密码 -->
        </span>
      </div>
      <div class='half textRight'>
        <router-link :to="{name: 'forget'}" tag='span'>找回密码？</router-link>
      </div>
    </div>
    <div class='loginTo'>
      <div class='blue' @click="login('A')" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        登录
      </div>
    </div>
    <!--<div class='allFlex maginAuto'>
        <div class='lineWidth'></div>
        <div class='textLogin'>或使用其他账号登录</div>
        <div class='lineWidth'></div>
    </div>
    <div class='loginTo'>
      <div class='green'>
        <img src='../assets/wx.png' class='wxLogo'/>
        微信登录
      </div>
    </div>-->
    <div class='textCenter'>
        注册登录即代表同意创亿金服<span class='lan' @click='toIframe()'>《用户协议》</span>
    </div>
    <div class='textCenter regtpbx'>
      <router-link :to="{name: 'registered'}" tag="span">注册</router-link>
    </div>
    <div class='bottomBlock'></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checked: true,
      phone: '',
      version: '',
      password: '',
      agentNo: '',
      fullscreenLoading: false,
      openId: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    login (type) {
      let vm = this
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
      if (vm.password.match(/^[ ]*$/)) {
        vm.$message({
          message: '密码必须填写',
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
        '3': '190928',
        '4': type,
        '8': vm.$md5(vm.password),
        '44': vm.agentNo,
        '46': vm.openId,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00' || res.data[39] === 'W8') {
            vm.$message({
              message: '登录成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
            new Promise((resolve, reject) => {
              vm.$stact.dispatch('SetToken', res.data[42]) // 存token 进行登录退出判断
              resolve()
            }).then(r => {
              if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
                vm.$router.push({ name: 'home' }) // ios 调路由第一次无法跳转存在问题 该问题是vue脚手架问题无法解决 侧面解决多运行一次
                setTimeout(() => {
                  vm.$router.push({ name: 'home' })
                }, 1000)
              } else {
                vm.$router.push({ name: 'home' })
              }
            })
              .catch(err => console.log(err))
          } else {
            if (res.data[39] === 'ZV') {
              vm.fullscreenLoading = true
              vm.$message({
                message: '版本更新中',
                center: true,
                offset: 30,
                duration: 2500,
                type: 'success'
              })
              setTimeout(() => {
                vm.fullscreenLoading = false
                window.location.reload()
              }, 2500)
              return
            }
            vm.$message({
              message: '账号或密码错误',
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
    toIframe () {
      this.$router.push({ name: 'ifarme', query: { url: 'http://chuangyijinfu.llyzf.cn/lly-posp-proxy/register.html?name=创亿金服', title: '用户协议' } })
    }
  }
}
</script>
