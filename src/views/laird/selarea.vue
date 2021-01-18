<template>
  <div class='jyj-selcity'>
    <div class="list-box" v-for="(item,index) in list" :key="index" @click="selectcity(item)">
      {{item.divisionName}}
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
      list: [],
      cityid: ''
    }
  },
  components: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.cityid = this.$route.query.cityid
    this.message()
  },
  methods: {
    selectcity (item) {
      let arr = []
      let sessioncity = JSON.parse(sessionStorage.getItem('citystay'))
      if (sessioncity.length === 4) {
        sessioncity.pop()
      }
      sessioncity.push(item)
      sessionStorage.setItem('citystay', JSON.stringify(sessioncity))
      this.$router.go(-1)
    },
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '393004',
        '43': vm.cityid,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.list = JSON.parse(res.data[57])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
