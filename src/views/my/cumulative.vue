<template>
    <div class='hundred'>
        <ul class='allFlex cumPadding'>
            <li>
                <div class='gary'>开始时间</div>
                <div @click='showTime(1)' class='textWeight'>{{searchTime}}</div>
            </li>
            <li>
                <div class='gary'>结束时间</div>
                <div @click='showTime(2)' class='textWeight'>{{endTime}}</div>
            </li>
        </ul>
        <div class='realTitle cumNopadd'>累积收益：{{sumMoney}}元</div>
        <ul v-infinite-scroll='load' infinite-scroll-disabled='disabled' style="overflow:auto" infinite-scroll-delay='1000'>
            <li class='allFlex paddProfit' v-for='item in moneyList' :key='item.ID' @click='toNext(item.id, item.trade_type, item.moneyType)'>
                <div class='half'>
                    <div class='smallWeight'>{{transaction[item.trade_type]?transaction[item.trade_type]:'其他'}}</div>
                    <div class='gary todayTop'>{{$moment(item.createTime.time).format('YYYY-MM-DD HH:mm:ss')}}</div>
                </div>
                <div class='half'>
                    <div class='blueColor textRight'>{{item.money}}</div>
                    <div class='textRight todayTop'>
                        查看详情
                        <img src='../../assets/right.png' class='teamNext marginLeft'/>
                    </div>
                </div>
            </li>
        </ul>
        <div class='timeBack'  v-show='show'>
        <div @click='showTime(0)' class='stopBack'></div>
        <el-calendar v-model="timeValue" class='timeDack'>
            <template
            slot="dateCell"
            slot-scope="{date, data}">
            <p :class="data.isSelected ? 'is-selected' : ''" @click='getTime()'>
                {{ data.day.split('-').slice(2).join('-') }}
            </p>
            </template>
        </el-calendar>
        </div>
        <div class='bottomLong'></div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      show: 0,
      timeValue: new Date(),
      timeTwo: new Date(),
      searchTime: '点击选择年月日',
      endTime: '点击选择年月日',
      type: 0,
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
      },
      sumMoney: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
  },
  computed: {
    noMore () {
      return this.count < 10
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  watch: {
    timeValue (n, o) {
      let vm = this
      switch (vm.type) {
        case 1:
          vm.searchTime = vm.$moment(n).format('YYYY-MM-DD')
          break
        case 2:
          vm.endTime = vm.$moment(n).format('YYYY-MM-DD')
          break
      }
      this.moneyList = []
      this.count = 10
      this.page = 0
      vm.load()
    }
  },
  methods: {
    showTime (type) {
      this.show = type
      this.type = type
    },
    getTime () {
      let vm = this
      vm.show = 0
    },
    load () {
      let vm = this
      vm.loading = true
      setTimeout(async () => {
        if (vm.count >= 10) {
          vm.page++
          vm.loading = false
          await vm.list()
        }
      }, 1000)
    },
    list () {
      let vm = this
      if (Date.parse(vm.searchTime.replace(/-/g, '/')) > Date.parse(vm.endTime.replace(/-/g, '/'))) {
        vm.$message({
          message: '开始时间不能大于结束时间',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      let parmas = {
        '0': '0700',
        '3': '690036',
        '42': vm.merchantNo,
        '37': vm.searchTime === '点击选择年月日' ? '' : vm.searchTime,
        '38': vm.endTime === '点击选择年月日' ? '' : vm.endTime,
        '43': vm.page,
        '44': 3,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.moneyList = vm.moneyList.concat(JSON.parse(res.data[57]))
            vm.sumMoney = res.data[46]
            vm.count = JSON.parse(res.data[57]).length
            console.log(vm.count)
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
