<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='bankgroud noPadding raduisBottom'>
        <div class='allFlex planBack exhaustiveBack'>
            <div class='half'>
                <img :src="banks[cardList.BANK_NAME]?require(`../../assets/bank/white/${banks[cardList.BANK_NAME]}.png`):require('../../assets/bank/white/yl.png')" class='bankLogo' />
                <span class='bankRight fourFont'>
                    {{cardList.short_cn_name}}
                </span>
            </div>
            <div class='half textRight'>
                <div>
                    <span class='garyChoose repayFont'>****</span>
                    <span class='repayPadding garyChoose whiteColor repayFont'>{{cardList.BANK_ACCOUNT.substring(cardList.BANK_ACCOUNT.length-4, cardList.BANK_ACCOUNT.length)}}</span>
                </div>
            </div>
        </div>
        <div class='exhaustiveBack'>
            <div class='widthExhaustive'></div>
        </div>
        <div class='allFlex choose planBackx exhaustiveBack'>
            <div class='garyChoose smallFont half textCenter'>
                <p class='whiteColor'>{{cardList.BILL_DAY}}</p>
                <p>账单日</p>
            </div>
            <div class='garyChoose smallFont half textCenter leftRight'>
                <p class='whiteColor'>{{cardList.REPAYMENT_DAY}}</p>
                <p>还款日</p>
            </div>
            <div class='garyChoose smallFont half textCenter'>
                <p class='whiteColor'>{{cardList.LIMIT_MONEY}}</p>
                <p>额度</p>
            </div>
        </div>
    </div>
    <ul class='planContent exhaustiveContent' v-for='item in listMore' :key='item.ID'>
        <li class='allFlex justifyBetween flexPadding'>
            <div>
            <span class='gary'>
                创建时间：
            </span>
            {{$moment(item.CREATE_TIME.time).format('YYYY-MM-DD HH:mm:ss')}}
            </div>
            <div>
            <span class='gary'>
                进度：
            </span>
            {{parseInt((item.payed/item.PLAN_AMT)*100)>100? 100 : parseInt((item.payed/item.PLAN_AMT)*100)}}%
            </div>
        </li>
        <li class='allFlex justifyBetween flexPadding'>
            <div>
            <span class='gary'>
                计划周期：
            </span>
            {{$moment(item.START_TIME.time).format('YYYY-MM-DD')}}至{{$moment(item.END_TIME.time).format('YYYY-MM-DD')}}
            </div>
        </li>
        <li class='allFlex justifyBetween flexPadding'>
            <div>
            <span class='gary'>
                本期应还：
            </span>
            {{item.PLAN_AMT}}
            </div>
            <div>
            <span class='gary'>
                本期已还：
            </span>
            {{item.payed}}
            </div>
        </li>
        <li class='allFlex justifyBetween flexPadding'>
            <div>
                <span class='gary'>
                    订单状态：
                </span>
                <span :class="item.STATUS === '10D' ? 'redColor': ''">{{status[item.STATUS]}}</span>
            </div>
            <div>
                <router-link :to="{name: 'particular', query: { item: JSON.stringify(item), cardList: JSON.stringify(cardList), merchantNo: usermerchantNo }}"  class='examine'>计划详情</router-link>
            </div>
        </li>
    </ul>
    <div class='bottomLong'  element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      cardList: [],
      banks: {
        313003: 'bj',
        303: 'gd',
        306: 'gf',
        105: 'js',
        301: 'jt',
        305: 'ms',
        103: 'ny',
        307: 'pa',
        309: 'xy',
        310: 'pf',
        403: 'yz',
        308: 'zs',
        102: 'gs',
        104: 'zg',
        302: 'zx',
        313062: 'sh',
        304: 'hx'
      },
      status: {
        '10A': '未执行',
        '10B': '执行中',
        '10C': '暂停',
        '10D': '失败',
        '10E': '完成'
      },
      now: -1,
      listMore: [],
      usermerchantNo: '',
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.cardList = JSON.parse(this.$route.query.item)
    this.usermerchantNo = this.$route.query.merchantNo
    this.list()
  },
  methods: {
    list () {
      let vm = this
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '190212',
        '42': vm.merchantNo,
        '43': vm.cardList.BANK_ACCOUNT,
        '59': vm.version
      }
      vm.fullscreenLoading = true
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            this.listMore = JSON.parse(res.data[57])
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    }
  }
}
</script>
