<template>
  <div class='hundred'>
    <div style='font-size:0'>
        <img src='../../assets/banner2.png' class='imgMax' />
    </div>
    <div  v-infinite-scroll='load' infinite-scroll-disabled='disabled' style="overflow:auto">
      <div class='homeTutorial' v-for='item in bannerList' :key='item.id' @click='toIframe(item.skipUrl, item.title)'>
        <div>
           <div class='tutorial'>
            {{item.title}}
          </div>
          <div class='tutorialImg'>
              <img :src='item.image' class='imgMin'>
          </div>
        </div>
      </div>
    </div>
    <p v-if="loading" style='padding: 0.2rem 0;text-align: center'>加载中...</p>
    <p v-if="noMore && !loading" class='gary' style='padding: 0.5rem 0;text-align: center'>没有更多了</p>
    <div class='bottomLong'></div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      agentNo: '',
      version: '',
      merchantNo: '',
      bannerList: [],
      cardUrl: '',
      page: 0,
      count: 10,
      loading: false
    }
  },
  computed: {
    noMore () {
      return this.count < 10
    },
    disabled () {
      return this.loading || this.noMore
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
    load () { // 拉下加载
      let vm = this
      vm.loading = true
      setTimeout(() => {
        vm.loading = false
        vm.page++
        vm.list()
      }, 1000)
    },
    toIframe (url, title) {
      window.location.href = url
    },
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '999001',
        '44': vm.page,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.bannerList = vm.bannerList.concat(JSON.parse(res.data[57]))
            vm.count = JSON.parse(res.data[57]).length
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
