<template>
  <div class='dx-feudallord'>
    <div class="title-banner">
      <img src="../../assets/feudallord/lz-banner.png" alt="">
    </div>
    <div class="feudallord-con">
      <img src="../../assets/feudallord/lz-con.png" alt="">
    </div>
    <router-link tag="div" :to="{name : 'feudalpage'}" class="success">
      同意
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  components: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    up () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '790008',
        '42': vm.merchantNo,
        '43': JSON.parse(this.$stact.state.token)[0].level,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.level = JSON.parse(JSON.parse(res.data[10]).configValue)
            console.log(vm.level)
            vm.img = vm.level[vm.$refs.mySwper.swiper.realIndex].putong
            vm.countvip = vm.level[vm.$refs.mySwper.swiper.realIndex].countvip
            vm.count = vm.level[vm.$refs.mySwper.swiper.realIndex].count
            vm.$refs.mySwper.swiper.realIndex === 1 && Number(vm.vip) === 1 ? vm.upTrue = true : vm.upTrue = false
            vm.$refs.mySwper.swiper.realIndex >= 2 && Number(vm.vip) < 3 ? vm.cusTrue = true : vm.cusTrue = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    upup () {
      let vm = this
      vm.$router.push({ name: 'pay', query: { money: vm.level[vm.$refs.mySwper.swiper.realIndex - 1].upmoney } })
    },
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.$stact.dispatch('SetToken', res.data[57]) // 存token
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
