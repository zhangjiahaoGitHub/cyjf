<template>
  <div class="deductionrecord-style">
    <div class="beijin-bg">
      <div class="font-s-bzj">保证金金额：{{shenyubzj}}元</div>
      <div class="tishi-wx">温馨提示：计划完成后，保证金可提现。</div>
      <div class="you-box">
        <div class="tx-b" @click="towithdrawbond">我要提现</div>
        <router-link tag="div" :to="{name: 'wanttorecharge'}" class="cz-b">我要充值</router-link>
      </div>
    </div>
    <div class="list-box">
      <div style="overflow:auto;height:18.7rem;">
        <div v-infinite-scroll="load" infinite-scroll-disabled="disabled">
          <div class="row-list" v-for="(item,index) in listarrall" :key="index">
            <div>
              <div class="cz">{{item.type}}</div>
              <div class="name-font">{{item.merchantName}} <span>{{item.phone.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")}}</span></div>
            </div>
            <div>
              <div :class="item.status == '+' ? 'cz-price' : 'jz-price'">{{item.status}}{{item.money}}</div>
              <div class="time-font">{{$moment(item.createTime.time).format('YYYY-MM-DD HH:mm:ss')}}</div>
            </div>
          </div>
        </div>
        <p style="text-align:center" class="more-b " v-if="loading">加载中...</p>
        <p style="text-align:center" class="more-b " v-if="!loading">没有更多了</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      phone: '',
      merchantId: '',
      version: '',
      agentNo: '',
      merchantNo: '',
      id: '',
      listarr: [],
      listarrall: [],
      shenyubzj: '0',
      page: 1,
      loading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.id = JSON.parse(this.$stact.state.token)[0].id
    this.phone = JSON.parse(this.$stact.state.token)[0].phone
    this.shenyubzj = JSON.parse(this.$stact.state.token)[0].personQykBond
    this.load()
  },
  computed: {
    noMore () {
      return this.listarr.length < 10
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    towithdrawbond() {
      this.$router.push({name: 'withdrawbond',query: {ktx: this.shenyubzj}})
    },
    load () {
      this.loading = true
      this.message()
    },
    message () {
      let vm = this
      vm.listarr = []
      let parmas = {
        '0': '0700',
        '3': '790022',
        '40': vm.page,
        '41': 10,
        '42': vm.id,
        '43': '10A',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.page++
            vm.$stact.dispatch('SetToken', res.data[32]) // 存token
            vm.shenyubzj = JSON.parse(res.data[32])[0].personQykBond
            vm.listarr = JSON.parse(res.data[57])
            let newStr = ''
            for(let i in vm.listarr) {
              if (vm.listarr[i].merchantName.length === 2) {
                  newStr = vm.listarr[i].merchantName.substr(0, 1) + '*'
              } else if (vm.listarr[i].merchantName.length > 2) {
                  var char = ''
                  for (let i = 0, len = vm.listarr[i].merchantName.length - 2; i < len; i++) {
                      char += '*'
                  }
                  newStr = vm.listarr[i].merchantName.substr(0, 1) + char + vm.listarr[i].merchantName.substr(-1, 1);
              } else {
                  newStr = vm.listarr[i].merchantName
              }
              vm.listarr[i].merchantName = newStr
              vm.listarrall.push(vm.listarr[i])
            }
          }
          vm.loading = false
        })
        .catch(err => {
          vm.loading = false
          console.log(err)
        })
    },
  }
}
</script>
