<template>
  <div class="systemnotice-systemnotice">
    <div class="notice-box">
      <div class="title">
        <div class="title-img">
          <img src="../../assets/noticetaitle.png" alt="">
          <!-- <i class="el-icon-message-solid"></i> -->
        </div>
        <p>{{itemList.title}}</p>
      </div>
      <div class="notic-content" style="white-space: pre-wrap">
        {{itemList.content}}
      </div>
      <p class="time">{{$moment(time).format('YYYY-MM-DD HH:mm:ss')}}</p>
    </div>
  </div>
</template>
<script>
import copy from 'copy-to-clipboard'
export default {
  data () {
    return {
      version: '',
      merchantNo: '',
      notice: '',
      noticecon: '',
      itemList: '',
      msgindex: Number,
      itemid: '',
      time: ''
    }
  },
  created () {
    this.more()
    this.version = this.$stact.state.version
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo // 获取商户号
    this.msgindex = this.$route.query.index
    this.itemid = this.$route.query.itemid
    console.log(this.itemid)
    this.getnotice()
  },
  methods: {
    getnotice () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190103',
        '21': vm.itemid,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.itemList = JSON.parse(res.data[57])[0]
            vm.time = vm.itemList.effectiveFromTime.time
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    more () {
      window.scrollTo(0, 0) // 回到顶部
    }
  }
}
</script>
