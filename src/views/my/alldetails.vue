<template>
    <div class='hundred' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        <div class='walletBlue textCenter'>
            <p class='teamPeople'>
                交易总额
            </p>
            <p class='teamNum'>
                {{withdraw}}
            </p>
        </div>
        <ul class='allFlex peopleFlex'>
            <li>
                <span :class="type === 1 ? 'peopleCheck': ''" @click='setType(1)'>
                    个人交易量
                </span>
            </li>
             <li>
                <span :class="type === 2 ? 'peopleCheck': ''" @click='setType(2)'>
                    团队交易量
                </span>
            </li>
        </ul>
        <ul class='allFlex dayMouth'>
            <li :class="day === '10A'? 'blueBack': ''" @click="newList('10A')">日交易</li>
            <li :class="day === '10B'? 'blueBack': ''" @click="newList('10B')">月交易</li>
        </ul>
        <div v-infinite-scroll='load' infinite-scroll-disabled='disabled' infinite-scroll-distance='50' style="overflow:auto; height: calc(100vh - 13.8rem)">
            <div class='business' v-for='(item, index) in teamList' :key='index'>
                <div class='busTitle'>{{item.dateTime}}</div>
                <div class='allFlex'>
                    <div class='half'>
                        <p class='gary'>{{day==='10A'? '日' : '月'}}收款(元)</p>
                        <p class='busMoney'>{{item.WKmoney}}</p>
                    </div>
                    <div class='half'>
                        <p class='gary'>{{day==='10A'? '日' : '月'}}还款(元)</p>
                        <p class='busMoney'>{{item.YKmoney}}</p>
                    </div>
                </div>
            </div>
            <p v-if="loading" style='padding: 0.2rem 0;text-align: center'>加载中...</p>
            <p v-if="noMore && !loading" class='gary' style='padding: 0.5rem 0;text-align: center'>没有更多了</p>
        </div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      type: 1,
      day: '10A',
      page: 0,
      count: 10,
      loading: false,
      version: '',
      agentNo: '',
      merchantNo: '',
      teamList: [],
      withdraw: '',
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.message()
  },
  computed: {
    noMore () {
      return this.count < 10
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    setType (type) {
      let vm = this
      vm.fullscreenLoading = true
      vm.type = type
      this.teamList = []
      this.count = 10
      this.page = 0
      this.load()
    },
    newList (day) {
      this.day = day
      this.teamList = []
      this.count = 10
      this.page = 0
      this.load()
    },
    load () {
      let vm = this
      vm.loading = true
      vm.fullscreenLoading = true
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
        '3': '790010',
        '23': vm.day,
        '24': vm.type,
        '32': vm.page,
        '33': '10',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.teamList = vm.teamList.concat(JSON.parse(res.data[13]))
            vm.count = JSON.parse(res.data[13]).length
            vm.withdraw = res.data[12]
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
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
