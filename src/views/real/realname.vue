<template>
  <div class="realname" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
    <div class="demo-input-suffix">
        <el-input
            placeholder="请输入姓名"
            prefix-icon="el-icon-search"
            v-model="input"
            @change="selectchange()"
            @input="space()">
        </el-input>
    </div>
    <div class="reallist">
      <div class="realindex" @click='toaddcard(item)' v-for='(item, i) in realnamelist' :key='i'>
        <span class="seria">{{i + 1}}、</span>
        {{item.merchantCnName}}
        <!-- ({{useStatustype[item.useStatus]}}) -->
        <span class="reallist-r">{{type[item.freezeStatus]}}</span></div>
    </div>
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
      let toAdditem = { id: data.id, idCardNumber: data.idCardNumber, merchantCnName: data.merchantCnName, phone: data.phone, merchantNo: data.merchantNo }
      switch (data.freezeStatus) {
        case '10A':
          vm.$message({
            message: '审核未通过',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          break
        case '10B':
          vm.$message({
            message: '审核已通过',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          break
        case '10C':
          vm.$message({
            message: '审核拒绝，请重新实名',
            center: true,
            offset: 30,
            duration: 2500,
            type: 'warning'
          })
          this.$router.push({ name: 'renew', query: { item: JSON.stringify(toAdditem) } })
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
        '43': vm.input, // 查找传入的参数
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          console.log(res.data[36])
          this.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.realnamelist = JSON.parse(res.data[37])
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    selectchange () {
      let vm = this
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
