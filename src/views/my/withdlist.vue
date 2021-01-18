<template>
    <div class='hundred'>
        <div v-infinite-scroll='load' infinite-scroll-disabled='disabled' style="overflow:auto">
            <ul class='borderMagin' v-for='(item, index) in teamList' :key='index'>
                <li class='allFlex paddProfit'>
                    <div class='half gary'>
                        提现状态
                    </div>
                    <div class='half textRight'>
                        {{type[item.status]}}
                    </div>
                </li>
                <li class='allFlex paddProfit'>
                    <div class='half gary'>
                        交易金额
                    </div>
                    <div class='half textRight'>
                        {{item.trxAmt}}
                    </div>
                </li>
                <li class='allFlex paddProfit'>
                    <div class='half gary'>
                        交易时间
                    </div>
                    <div class='half textRight'>
                        {{$moment(item.createTime.time).format('YYYY-MM-DD HH:mm:ss')}}
                    </div>
                </li>
            </ul>
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
      page: 0,
      count: 10,
      loading: false,
      version: '',
      agentNo: '',
      merchantNo: '',
      teamList: [],
      type: {
        '10A': '提现受理失败',
        '10B': '提现中',
        '10C': '提现成功',
        '10D': '提现失败'
      }
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
        '3': '190125',
        '8': '10A',
        '42': vm.merchantNo,
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
    }
  }
}
</script>
