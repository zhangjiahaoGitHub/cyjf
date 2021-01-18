<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div>
        <div class='bankgroud noPadding'>
            <div class='allFlex planBack'>
                <div>
                    <img :src="banks[cardList.BANK_NAME]?require(`../../assets/bank/white/${banks[cardList.BANK_NAME]}.png`):require('../../assets/bank/white/yl.png')" class='bankLogo' />
                    <span class='bankRight fourFont'>
                        {{cardList.short_cn_name}}
                    </span>
                </div>
                <div class='textRight'>
                    <div>
                      <span class='repayPadding garyChoose whiteColor repayFont'>尾号{{cardList.BANK_ACCOUNT.substring(cardList.BANK_ACCOUNT.length-4, cardList.BANK_ACCOUNT.length)}}</span>
                    </div>
                </div>
            </div>
            <div class='allFlex choose border planBackx'>
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
            <div class='leftRaduis'></div>
            <div class='rightRaduis'></div>
        </div>
        <div class='planContent'>
          <ul>
          <li v-if='multi' class='allFlex justifyBetween flexPadding'>
              <div>{{$stact.state.allSb.textAlise}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='gary'>还款全额</div>
              <div>{{money}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='gary'>还款周期</div>
              <div>{{searchTime}} - {{endTime}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding' v-if="tong != 'QYK' && $route.query.value">
              <div class='gary'>日还款笔数</div>
              <div>{{value}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding' v-if="tong != 'QYK'">
              <div class='gary'>周转金</div>
              <div>{{calcList[40]}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='gary'>还款手续费</div>
              <div>{{calcList[9]}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='gary'>还款笔数费</div>
              <div>{{calcList[7]}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='gary'>{{tong != 'QYK' ? '周转金总额' : '手续费总额'}}</div>
              <div>{{tong != 'QYK' ? zhou : shou}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='gary'>消费地区</div>
              <div>{{area}}</div>
            </li>
          </ul>
          <div class='allFlex justifyBetween planMargin'>
            <router-link :to="{name: 'preview', query: { acqcode: $route.query.acqcode, rate: $route.query.rate, children: $route.query.children, keep: 1, money: money, searchTime: searchTime, endTime: endTime, value: value, tong: tong, merchantNo: usermerchantNo, multi: multi }}" class='submitPlan'>预览详细计划</router-link>
            <router-link :to="{name: 'make', query: { acqcode: $route.query.acqcode, rate: $route.query.rate, keep: 1, tong: tong, merchantNo: usermerchantNo, lazyPeople: lazyPeople, multi: multi }}" tag='div' class='submitPlan'>修改计划</router-link>
          </div>
          <div class='loginTo makeTo'>
            <div class='blue' @click="tong != 'QYK'?next():nextSmall()"  element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
              提交计划
            </div>
          </div>
      </div>
    </div>
    <div class='bottomLong'></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      usermerchantNo: '',
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
      now: -1,
      calcList: [],
      searchTime: '',
      endTime: '',
      value: 0,
      valuex: 0,
      money: 0,
      planItem: '',
      fullscreenLoading: false,
      area: '',
      zhou: 0,
      shou: 0,
      cityList: [],
      lazyPeople: false,
      multi: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.searchTime = this.$route.query.searchTime
    this.endTime = this.$route.query.endTime
    this.calcList = this.$stact.state.allSb.calcList
    this.zhou = Math.floor(Number(this.calcList[40]) * 100 + Number(this.calcList[9]) * 100 + Number(this.calcList[7]) * 100) / 100
    this.shou = Math.floor(Number(this.calcList[9]) * 100 + Number(this.calcList[7]) * 100) / 100
    this.value = this.$route.query.value
    this.valuex = this.$route.query.valuex
    this.money = this.$route.query.money
    this.planItem = this.$stact.state.planItem
    this.cardList = this.$stact.state.allSb.cardList
    this.area = this.$route.query.area
    this.tong = this.$route.query.tong
    this.usermerchantNo = this.$route.query.merchantNo
    this.children = this.$route.query.children
    this.lazyPeople = this.$route.query.lazyPeople
    this.multi = this.$route.query.multi
    this.merchantList()
    if (this.usermerchantNo) {
      this.merchantNo = this.usermerchantNo
    }
  },
  mounted () {
    if (document.querySelector('.el-cascader__dropdown')) {
      document.querySelector('.el-cascader__dropdown').style.display = 'none'
    }
  },
  methods: {
    merchantList () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '490006',
        '30': vm.cardList.bankId,
        '31': vm.children[0],
        '32': vm.children[1],
        '33': vm.$route.query.acqcode,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            let cityCray = {}
            vm.planItem.map((x, i) => {
              cityCray = JSON.parse(res.data[38])[Math.floor(Math.random() * JSON.parse(res.data[38]).length)]
              x.cityindustryName = cityCray.acqMerchantName
              x.cityindustry = cityCray.acqMerchantNo
              if (i === vm.planItem.length - 1) {
                vm.$stact.commit('SET_PLAN', vm.planItem)
              }
            })
          }
          console.log(vm.planItem)
        })
        .catch(err => {
          console.log(err)
        })
    },
    next () {
      let vm = this
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '190210',
        '8': vm.money,
        '9': vm.zhou,
        '10': Date.parse(vm.searchTime.replace(/-/g, '/')),
        '11': Date.parse(vm.endTime.replace(/-/g, '/')),
        '12': vm.calcList[9],
        '13': vm.calcList[7],
        '14': vm.$route.query.value ? vm.$route.query.value : '2',
        '16': '2',
        '23': vm.multi ? '3' : '2',
        '42': vm.merchantNo,
        '43': vm.multi ? this.$stact.state.allSb.checkList : vm.$route.query.acqcode,
        '57': JSON.stringify(vm.planItem),
        '59': vm.version
      }
      let url = vm.$mdata.mdGet(parmas)
      vm.fullscreenLoading = true
      vm.$http.post('request.app', url)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '提交成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
            if (this.usermerchantNo) {
              vm.$router.push({ name: 'checkplan' })
            } else {
              vm.$router.push({ name: 'repayment' })
            }
          } else {
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    nextSmall () {
      let vm = this
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '390049',
        '8': vm.money,
        '10': Date.parse(vm.searchTime.replace(/-/g, '/')),
        '11': Date.parse(vm.endTime.replace(/-/g, '/')),
        '12': vm.calcList[9],
        '13': vm.calcList[7],
        '42': vm.merchantNo,
        '43': vm.$route.query.acqcode,
        '44': vm.$stact.state.newem ? vm.$stact.state.newem : '',
        '57': JSON.stringify(vm.planItem),
        '59': vm.version
      }
      let url = vm.$mdata.mdGet(parmas)
      vm.fullscreenLoading = true
      vm.$http.post('request.app', url)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '提交成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
            vm.$router.push({ name: 'emptyrepayment' })
          } else {
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
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
