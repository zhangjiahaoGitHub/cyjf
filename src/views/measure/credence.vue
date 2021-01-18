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
              <input type="number" v-model='phone' placeholder='手机号码' oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')" />
          </div>
          <div class='credInput'>
              <input type="password" v-model='card' placeholder='手机号服务密码' oninput="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')" onafterpaste="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')"/>
          </div>
          <div class='textCenter fiveFont'>查询费用：<span class='redColor'>10元</span></div>
          <div class='credCom textCenter' @click='get()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
            确定查询
          </div>
          <p class='credMess credp'>
            查询须知：
          </p>
          <p class='credp'>
            提示：征信大约需要两分钟的个人信息搜索时间，不能实时响应，提交成功后，请于查询记录中查看;
          </p>
          <p class='credp'>
            1.手机好服务密码是登录手机营业厅的密码
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
      team: {}
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
  },
  mounted () {
  },
  methods: {
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
      this.$confirm('此次查询费用10元，将从可提现分润扣除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          '0': '0700',
          '3': '690018',
          '42': vm.merchantNo,
          '43': vm.name,
          '44': vm.idCard,
          '45': vm.phone,
          '46': vm.$md5(vm.card),
          '47': 3,
          '59': vm.version
        }
        let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
        vm.fullscreenLoading = true
        vm.$http.get(`request.app${url}`)
          .then(res => {
            vm.fullscreenLoading = false
            if (res.data[39] === '00') {
              vm.itemList = JSON.parse(res.data[60])
            } else {
              vm.$message({
                message: res.data[39],
                center: true,
                offset: 30,
                duration: 2500,
                type: 'success'
              })
            }
            if (res.data[39].replace(/\s/g, '') === '征信余额不足请及时充值') {
              vm.$router.push({ name: 'pay' })
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
