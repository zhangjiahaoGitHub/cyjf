<template>
  <div class='hundred'>
    <div  v-infinite-scroll='load' infinite-scroll-disabled='disabled' style="overflow:auto">
      <div class='homeTutorial' v-for='item in bannerList' :key='item.id'>
        <div>
            <div class='allFlex'>
                <div class='half gary'>
                    {{$moment(item.updateTime.time).format('YYYY-MM-DD HH:mm:ss')}}
                </div>
            </div>
           <div class='tutorial unsetLine noLfetborder'>
            {{item.context}}
          </div>
          <div class='allFlex homeList threeList'>
            <div class='textCenter' v-for="(row,index) in item.picPaths.split(',')" :key='index'>
                <el-image  v-if='item.picPaths' :preview-src-list="item.picPaths.split(',')" :src='row'  class='imageTwo imgTix' />
            </div>
          </div>
          <!-- <div class='allFlex'>
                <div class='half'>
                   </div>
                <div class='half textRight gary'>
                    <a class='copy' @click='copyText(item.context)'>复制文本</a>
                </div>
            </div> -->
        </div>
      </div>
    </div>
    <p v-if="loading" style='padding: 0.2rem 0;text-align: center'>加载中...</p>
    <p v-if="noMore && !loading" class='gary' style='padding: 0.5rem 0;text-align: center'>没有更多了</p>
    <div class='bottomLong'></div>
  </div>
</template>
<script>
import copy from 'copy-to-clipboard'

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
    copyText (text) {
      if (text) {
        copy(text, {
          debug: true,
          message: '复制成功'
        })
      }
    },
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '690032',
        '43': vm.page,
        '44': vm.agentNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            console.log(JSON.parse(res.data[57]))
            vm.bannerList = vm.bannerList.concat(JSON.parse(res.data[57]))
            vm.count = JSON.parse(res.data[57]).length
            console.log(vm.count)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  destroyed () {
    document.querySelector('body').style.overflow = ''
  }
}
</script>
