<template>
    <div class='hundred'>
        <ul class='borderMagin'  v-infinite-scroll='load' infinite-scroll-disabled='disabled' style="overflow:auto">
            <li class='allFlex paddProfit' v-for='item in moneyList' :key='item.ID' @click='toNext(item.id, item.trade_type, item.moneyType)'>
                <div class='half gary'>
                    {{$moment(item.createTime.time).format('YYYY-MM-DD HH:mm:ss')}}
                </div>
                <div class='half blueColor textRight'>
                    {{item.money}}
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
      moneyList: [],
      transaction: {
        'AQYK': '全额还手续费',
        'BK': '申请信用卡',
        'CZWX': '微信充值',
        'CZZFB': '支付宝充值',
        'DK': '贷款',
        'HB': '花呗',
        'HK': '代还还款',
        'JF': '积分兑换',
        'JP': '领主竞拍',
        'QHK': '全额还款',
        'QYK': '全额代付',
        'TK': '退款',
        'WK': '银联快捷',
        'WXPAY': '微信',
        'WXSM': '亿贤微信',
        'YK': '代还消费',
        'YKXE': '代还消费（小额）',
        'YSWXSM': '微信扫码支付',
        'YSZFBSM': '支付宝扫码支付',
        'ZFB': '支付宝',
        'JHJL': '激活奖励',
        'SMJL': '实名奖励',
        'ZFBSM': '亿贤支付宝'
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
    this.type = this.$route.query.type
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
        '3': '690036',
        '42': vm.merchantNo,
        '43': vm.page,
        '44': vm.type,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.moneyList = vm.moneyList.concat(JSON.parse(res.data[57]))
            console.log(JSON.parse(res.data[57]))
            vm.count = JSON.parse(res.data[57]).length
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    toNext (order, tradetype, moneytype) {
      let vm = this
      vm.$router.push({ name: 'details', query: { order: order, tradetype: tradetype, moneytype: moneytype } })
    }
  }
}
</script>
