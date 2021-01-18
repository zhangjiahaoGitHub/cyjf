<template>
  <div class="realname" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
    <div class="demo-input-suffix clear-mar">
        <el-input
            placeholder="请输入姓名"
            prefix-icon="el-icon-search"
            v-model="input"
            @change="selectchange()"
            @input="space()">
        </el-input>
    </div>
    <div class="card-count">
      <span class="zong">总卡位数：{{screensAllNumber || 0}}</span>
      <span class="sheng">剩余可绑卡位：{{screensNumber || 0}}</span>
    </div>
    <div class="reallist">
      <div class="realindex" v-for='(item, i) in realnamelist' :key='i'>
        <span class="seria">{{i + 1}}、</span>
        {{item.merchantCnName}}
        <span class="makeplan-addcard makeplan-bg" @click="toselectcard(item.merchantNo, item)">制定计划</span><span class="makeplan-addcard" @click="toaddcard(item)">添加卡片</span></div>
    </div>
    <router-link tag='div' :to="{name: 'addposition'}" class="addposition">
      增加卡位
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: '',
      realnamelist: [],
      type: {
        '10A': '审核未通过',
        '10B': '审核通过',
        '10C': '拒绝审核',
        '10D': '重新审核'
      },
      useStatustype: {
        '10A': '可用',
        '10B': '不可用'
      },
      screensAllNumber: '', // 总卡位
      screensNumber: '', // 剩余卡位
      clearsettimeout: null,
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.fullscreenLoading = true
    this.reallist()
  },
  methods: {
    toaddcard (data) {
      let vm = this
      switch (data.freezeStatus) {
        case '10A':
          vm.$message({
            message: '审核中',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          break
        case '10B':
          let toAdditem = { id: data.id, idCardNumber: data.idCardNumber, merchantCnName: data.merchantCnName, phone: data.phone }
          this.$router.push({ name: 'addcard', query: { merchantNo: data.merchantNo, item: JSON.stringify(toAdditem) } })
          break
        case '10C':
          vm.$message({
            message: '审核拒绝，请重新实名',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          this.$router.push({ name: 'renew', query: { item: JSON.stringify(data) } })
          break
        case '10D':
          vm.$message({
            message: '重新审核中，无法操作',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          break
        default:
          vm.$message({
            message: '审核中',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          break
      }
    },
    toselectcard (merchantNo, item) {
      let vm = this
      switch (item.freezeStatus) {
        case '10A':
          vm.$message({
            message: '审核中',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          break
        case '10B':
          this.$router.push({ name: 'selectcard', query: { merchantNo: merchantNo, merchantId: item.id } })
          break
        case '10C':
          vm.$message({
            message: '审核拒绝，请重新实名',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          this.$router.push({ name: 'renew', query: { item: JSON.stringify(item) } })
          break
        case '10D':
          vm.$message({
            message: '重新审核中，无法操作',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          break
        default:
          vm.$message({
            message: '审核中',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          break
      }
    },
    reallist () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '390012',
        '42': vm.merchantNo,
        '43': vm.input, // 这是查找传入的名字
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.realnamelist = JSON.parse(res.data[37])
            vm.screensAllNumber = JSON.parse(res.data[36])[0].screensAllNumber
            vm.screensNumber = JSON.parse(res.data[36])[0].screensNumber
            // console.log(JSON.parse(res.data[36]))
          }
        })
        .catch(err => {
          console.log(err)
          vm.fullscreenLoading = false
        })
    },
    selectchange () {
      let vm = this
      vm.fullscreenLoading = true
      vm.reallist()
    },
    space () {
      let vm = this
      clearTimeout(vm.clearsettimeout)
      if (vm.input === '') {
        vm.clearsettimeout = setTimeout(() => {
          vm.fullscreenLoading = true
          vm.reallist()
        }, 1000)
      }
    }
  }
}
</script>
