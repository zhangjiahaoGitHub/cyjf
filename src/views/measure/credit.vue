<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='credBorder'>
        <div class='credCom nocredt' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
          基本信息
        </div>
        <div class='paddcred'>
          <div class='credInput'>
            <input type="text" placeholder='姓名' v-model='name' />
          </div>
          <div class='credInput'>
              <input type="text" v-model='idCard' oninput="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')" onafterpaste="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')"  placeholder='身份证'/>
          </div>
          <div class='credInput'>
              <input type="text" v-model='card' placeholder='请输入本人信用卡卡号' oninput="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')" onafterpaste="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')"/>
          </div>
          <div class='credInput'>
              <input type="number" v-model='phone' placeholder='请输入预留手机号' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')" />
          </div>
          <div class='loginInput loginIx border' style='width: 100%'>
            <el-checkbox  v-model="checked" style="margin-right:0.3rem;display:flex;align-item:center;"></el-checkbox>我已阅读并同意<span @click="toIframe()" class='blueColor'>《用户授权协议》</span>
          </div>
          <div class='textCenter fiveFont'>查询费用：<span class='redColor'>{{cardMoney}}元</span></div>
          <div class='credCom textCenter' @click='get()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
            确定查询
          </div>
          <p class='credMess credp'>
            查询须知：
          </p>
          <p class='credp'>
            1.两个月内新卡请勿查询，否则查无结果;
          </p>
          <p class='credp'>
            2.近半年内未交易的卡请勿查询，否则查无结果;
          </p>
          <p class='credp'>
            3.请确保输入信息属实，否则查无结果;
          </p>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      fullscreenLoading: false,
      name: '',
      idCard: '',
      card: '',
      phone: '',
      share: 0,
      cardMoney: 0,
      checked: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.cardMoney = this.$stact.state.moAll.kcp
  },
  mounted () {
  },
  watch: {
    $route (to, from) {
      let vm = this
      if (to.name !== 'ifarme' && from.name === 'credit') {
        vm.name = ''
        vm.idCard = ''
        vm.card = ''
        vm.phone = ''
      }
    }
  },
  methods: {
    toIframe () {
      this.$router.push({ name: 'ifarme', query: { url: 'http://chuangyijinfu.llyzf.cn/lly-posp-proxy/kcp.html', title: '用户授权协议' } })
    },
    get () {
      let vm = this
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
      if (this.idCard.match(/^[ ]*$/)) {
        this.$message({
          message: '身份证必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (this.card.match(/^[ ]*$/)) {
        this.$message({
          message: '信用卡卡号必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
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
      if (!this.checked) {
        this.$message({
          message: '请先勾选用户授权协议',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      this.$confirm(`此次查询费用${vm.cardMoney}元`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          '0': '0700',
          '3': '690016',
          '40': vm.merchantNo,
          '41': vm.phone,
          '42': vm.idCard,
          '43': vm.card,
          '44': vm.name,
          '59': vm.version
        }
        let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
        vm.fullscreenLoading = true
        vm.$http.get(`request.app${url}`)
          .then(res => {
            vm.fullscreenLoading = false
            if (res.data[39] === '00') {
              vm.$router.push({ name: 'ifarme', query: { url: res.data[38], title: '卡测评' } })
            } else {
              vm.$message({
                message: res.data[39],
                center: true,
                offset: 30,
                duration: 2500,
                type: 'success'
              })
            }
            if (res.data[39].replace(/\s/g, '') === '账户余额不足，请充值') {
              vm.$router.push({ name: 'paycopy' })
              return
            }
            if (res.data[39].replace(/\s/g, '') === '余额不足请充值！') {
              vm.$router.push({ name: 'paycopy' })
              return
            }
            if (res.data[39].replace(/\s/g, '') === '余额不足请充值!') {
              vm.$router.push({ name: 'paycopy' })
            }
          })
          .catch(err => {
            vm.fullscreenLoading = false
            console.log(err)
          })
      }).catch(() => {
      })
    }
  }
}
</script>
