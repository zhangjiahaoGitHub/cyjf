<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='retreatRemarks black retBor' @click="problem(item.IC_SER_NO, '卡测评详情')" v-for='(item, index) in teamList' :key='index'>
        <p>卡号：{{item.CARD_NO}}</p>
        <p class='timePadding'>时间：{{$moment(item.CREATE_TIME.time).format('YYYY-MM-DD HH:mm:ss')}}</p>
        <p class='blueColor'>点击查看</p>
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
      id: '',
      teamList: []
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.id = JSON.parse(this.$stact.state.token)[0].id
    this.list()
  },
  mounted () {
  },
  methods: {
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '690020',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.teamList = JSON.parse(res.data[57])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    problem (url, title) {
      this.$router.push({ name: 'ifarme', query: { url: url, title: title } })
    }
  }
}
</script>
