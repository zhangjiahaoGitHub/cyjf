<template>
    <div class='hundred'>
       <div class='allFlex bankList bankLtitle borderMagin'>
            <div class='half'>姓名</div>
            <div class='half'>电话</div>
            <div class='half'>注册日期</div>
            <div class='half'></div>
        </div>
        <ul  v-infinite-scroll='load' infinite-scroll-disabled='disabled' style="overflow:auto">
            <li class='allFlex bankList gary' v-for='item in teamList' :key='item.ID'>
                <div class='half'>{{isNaN(item.NAME) ? item.NAME.length === 2? item.NAME.substring(0,1)+'*' : item.NAME.substring(0,1)+'*'+item.NAME.substring(item.NAME.length-1,item.NAME.length) : '未实名'}}</div>
                <div class='half'>{{item.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</div>
                <div class='half'>{{$moment(item.createTime.time).format('YYYY-MM-DD')}}</div>
                <div class='half'>
                    <img src='../../assets/call.png' class='callPhone' @click='tellPhone(item.phone)'/>
                </div>
            </li>
        </ul>
        <p v-if="loading" style='padding: 0.2rem 0;text-align: center'>加载中...</p>
        <p v-if="noMore && !loading" class='gary' style='padding: 0.5rem 0;text-align: center'>没有更多了</p>
        <div class='bottomLong'></div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      page: 0,
      count: 10,
      loading: false,
      version: '',
      agentNo: '',
      merchantNo: '',
      teamList: [],
      name: ''
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
  methods: {
    load () {
      let vm = this
      vm.loading = true
      setTimeout(async () => {
        vm.loading = false
        if (vm.count >= 10) {
          vm.page++
          await vm.list()
        }
      }, 1000)
    },
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '999201',
        '42': vm.merchantNo,
        '43': vm.page,
        '44': '10C',
        '45': vm.name,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.teamList = vm.teamList.concat(JSON.parse(res.data[57]))
            vm.count = JSON.parse(res.data[57]).length
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    tellPhone (phone) {
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      window.location.href = 'tel://' + phone
      if (isAndroid) {
        window.android.call(phone)
      }
      if (isiOS) {
        window.webkit.messageHandlers.interaction.postMessage(phone)
      }
    }
  }
}
</script>
