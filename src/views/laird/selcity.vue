<template>
  <div class='jyj-selcity'>
    <div v-if="$route.meta.selcity" class="leftRouter leftwihteRouter">
      <img src="../../assets/leftArrow.png" v-if="$route.meta.selcity"  class="leftArrow" @click="goTop()"/>
      {{$route.meta.title}}
    </div>
    <div v-if="$route.meta.selcity" class="top-top-height"></div>
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
      selectflag: true,
      citysession: []
    }
  },
  components: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.citysession.push(this.$route.query.selectlevel)
    this.message('0')
  },
  methods: {
    goTop () {
      this.$router.go(-1)
    },
    selectcity (item) {
      let vm = this
      vm.citysession.push(item)
      if (vm.selectflag) {
        vm.selectflag = false
        vm.message(item.id)
        return
      }
      if (!vm.selectflag) {
        sessionStorage.setItem('city', JSON.stringify(vm.citysession))
        sessionStorage.setItem('citystay', JSON.stringify(vm.citysession))
        vm.$router.push({ name: 'application' })
      }
    },
    message (type) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '393004',
        '43': type,
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
