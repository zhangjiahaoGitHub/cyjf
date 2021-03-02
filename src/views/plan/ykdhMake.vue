<template>
  <div class='hundred ykdhMake-layout'>
    <div class='bankgroud noPadding widthykd'>
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
    <ul>
      <li>
        <span>主卡</span>
        <input type="number" v-model="cardList.BANK_ACCOUNT" disabled>
      </li>
      <li>
        <span>还款金额</span>
        <input v-model="money" type="text" placeholder="请输入本张卡片还款金额" @input='IsMoney(money, 2)'>
      </li>
      <li style="padding-top:0.2rem;padding-bottom:0.2rem;">
        <span>多还卡片</span>
        <el-select v-model="cardArr" :multiple-limit='2' value-key="bankId"  multiple placeholder="请选择多还的卡片" size="mini">
          <el-option
            v-for="item in cardListArr"
            :key="item.BANK_ACCOUNT"
            :label="`${item.short_cn_name}${item.BANK_ACCOUNT.substring(0,4)} **** **** ${item.BANK_ACCOUNT.substring(item.BANK_ACCOUNT.length-4,item.BANK_ACCOUNT.length)}`"
            :value="item">
          </el-option>
        </el-select>
      </li>
      <li>
        <span>卡内预留金</span>
        <input v-model="lostMoney" type="text" placeholder="卡内剩余可用金额" @input='IsMoney(lostMoney, 3)'>
      </li>
    </ul>
    <div>
      <div class="block allFlex">
        <div class='makeWidth'>请选择商户： </div>
          <el-cascader class='makeMax'
            v-loading='loading'
            separator=" - "
            v-model="children"
            :options="cityList"
            @expand-change="handleChange">
          </el-cascader>
        </div>
    </div>
    <div  v-for='(item, index) in cardArr' :key='item.bankId'>
      <div class='bankgroud noPadding widthykd'>
        <div class='allFlex planBack'>
            <div>
                <img :src="banks[item.BANK_NAME]?require(`../../assets/bank/white/${banks[item.BANK_NAME]}.png`):require('../../assets/bank/white/yl.png')" class='bankLogo' />
                <span class='bankRight fourFont'>
                    {{item.short_cn_name}}
                </span>
            </div>
            <div class='textRight'>
                <div>
                    <span class='repayPadding garyChoose whiteColor repayFont'>尾号{{item.BANK_ACCOUNT.substring(item.BANK_ACCOUNT.length-4, item.BANK_ACCOUNT.length)}}</span>
                </div>
            </div>
        </div>
        <div class='allFlex choose border planBackx'>
            <div class='garyChoose smallFont half textCenter'>
                <p class='whiteColor'>{{item.BILL_DAY}}</p>
                <p>账单日</p>
            </div>
            <div class='garyChoose smallFont half textCenter leftRight'>
                <p class='whiteColor'>{{item.REPAYMENT_DAY}}</p>
                <p>还款日</p>
            </div>
            <div class='garyChoose smallFont half textCenter'>
                <p class='whiteColor'>{{item.LIMIT_MONEY}}</p>
                <p>额度</p>
            </div>
        </div>
      </div>
      <ul>
        <li>
          <span>副卡</span>
          <input type="number" v-model="item.BANK_ACCOUNT" disabled>
        </li>
        <li>
          <span>还款金额</span>
          <input v-model="cardMoney[index].money" @input='IsMoney(cardMoney[index].money, index)' type="text" placeholder="请输入本张卡片还款金额">
        </li>
      </ul>
    </div>
    <div class='loginTo makeTo'>
      <div class='blue widthykd' @click="tong != 'QYK'?calculation():calcSmall()">
          计算周转金
      </div>
    </div>
    <ol v-if="calcList[9]">
      <li>
        <span>卡内预留金</span><span>{{calcList[11]?calcList[11]: '0.00'}}</span>
      <li>
      <li>
        <span>还款手续费</span><span>{{calcList[9]?calcList[9]: '0.00'}}</span>
      </li>
      <li>
        <span>还款笔数费</span><span>{{calcList[7]?calcList[7]: '0.00'}}</span>
      </li>
      <li>
        <span>周转金总额</span><span>￥{{Math.floor(Number(calcList[11])*100 + Number(calcList[9])*100+Number(calcList[7])*100)/100}}</span>
      </li>
    </ol>
    <div class='loginTo makeTo'>
      <div class='blue widthykd' :class="refer||'garyMake'" @click="refer?sumbitRefer():''" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        下一步
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  data () {
    let me = this
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      usermerchantNo: '',
      cardList: [],
      cardListArr: [],
      cardArr: [],
      cardMoney: [
        {
          money: ''
        },
        {
          money: ''
        }
      ],
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
      money: '',
      payFee: 0,
      timeValue: new Date(),
      timeTwo: new Date(),
      searchTime: '点击选择年月日',
      endTime: '点击选择年月日',
      show: 0,
      type: 0,
      showCalc: 0,
      value: '3',
      valuex: '1',
      plantype: '',
      options: [{
        value: '1',
        label: '每日还款一笔'
      },
      {
        value: '2',
        label: '每日还款二笔'
      },
      {
        value: '3',
        label: '每日还款三笔'
      }],
      optionx: [
        {
          value: '1',
          label: '消一还一'
        },
        {
          value: '2',
          label: '消二还二'
        }
      ],
      children: [],
      cityList: [],
      calcList: [],
      dateList: [],
      fullscreenLoading: false,
      future: '',
      centerDialogVisible: false,
      loading: false,
      refer: 0,
      planItem: [],
      tradeList: [],
      changeNum: 0,
      planTure: 1,
      tong: '',
      pickerOptions: {
        disabledDate (time) {
          let a = time.getTime() < Date.now()
          return a
        }
      },
      dates: [],
      lostMoney: ''
    }
  },
  watch: {
    '$route' (to, from) {
      this.tong = this.$route.query.tong
      if (this.$route.query.item) {
        this.cardList = JSON.parse(this.$route.query.item)
        console.log(this.cardList)
      }
      this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
      this.usermerchantNo = ''
      this.usermerchantNo = this.$route.query.merchantNo
      if (this.usermerchantNo) {
        this.merchantNo = this.usermerchantNo
      }
      this.planTure = 1
      this.city(0)
      if (from.name === 'ykdhMake') {
      } else if (from.name === 'ykdpre') {} else {
        this.money = ''
        this.lostMoney = ''
        this.cardMoney = [{ money: '' }, { money: '' }]
        this.dates = []
        this.children = []
        this.cardArr = []
        this.calcList = []
        this.list()
      }
    },
    money (n, o) {
      this.refer = 0
    },
    cardMoney: {
      handler (n, o) {
        this.refer = 0
      },
      deep: true
    },
    lostMoney (n, o) {
      this.refer = 0
    },
    cardArr: {
      handler (n, o) {
        this.refer = 0
        console.log(this.cardArr)
        if (this.cardArr.length === 1) {
          this.aqlist(this.cardArr[0], this.cardArr[0].bankId)
        }
        if (this.cardArr.length === 2) {
          this.aqlist(this.cardArr[1], this.cardArr[1].bankId)
        }
      },
      deep: true
    },
    dates (n, o) {
      this.refer = 0
    },
    value (n, o) {
      this.refer = 0
    },
    valuex (n, o) {
      this.refer = 0
    },
    children (n, o) {
      this.refer = 0
    }
  },
  created () {
    let me = this
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.cardList = JSON.parse(this.$route.query.item)
    this.plantype = this.$route.query.plantype
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.usermerchantNo = ''
    this.usermerchantNo = this.$route.query.merchantNo
    if (this.usermerchantNo) {
      this.merchantNo = this.usermerchantNo
    }
    this.tong = this.$route.query.tong
    if (this.plantype == 'js') {
      this.$set(this,'options',[{ value: '1', label: '每日还款1笔' }, { value: '2', label: '每日还款2笔' }, { value: '3', label: '每日还款3笔' }, { value: '4', label: '每日还款4笔' }, { value: '5', label: '每日还款5笔' }, { value: '6', label: '每日还款6笔' }, { value: '7', label: '每日还款7笔' }, { value: '8', label: '每日还款8笔' }, { value: '9', label: '每日还款9笔' }, { value: '10', label: '每日还款10笔' }])
    }
    console.log(this.cardList)
    this.city(0)
    this.list()
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    aqlist (card, bankId) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '390013',
        '5': 1,
        '41': 1,
        '42': vm.merchantNo,
        '43': 'YK',
        '44': bankId,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            JSON.parse(res.data[57]).acqData.map((x, i) => {
              if (x.acqcode === vm.$route.query.acqcode && x.status === '未开通') {
                vm.$message({
                  message: '副卡未绑定该通道',
                  center: true,
                  offset: 30,
                  duration: 2500,
                  type: 'warning'
                })
                vm.$router.push({ name: 'matter', query: { item: JSON.stringify(card), type: 'YK' } })
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    list () {
      let vm = this
      vm.cardListArr = []
      let parmas = {
        '0': '0700',
        '3': '190932',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            let dataArr = JSON.parse(res.data[57])
            dataArr.forEach(item => {
              if (!item.plancount > 0 && item.BANK_ACCOUNT !== this.cardList.BANK_ACCOUNT) {
                this.cardListArr.push(item)
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    IsMoney (money, type) { // 限制
      let vm = this
      let value = money
      value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      if (value.indexOf('.') < 0 && value !== '') { // 以上已经过滤,此处控制的是如果没有小数点,首位不能为类似于 01、02的金额
        value = parseFloat(value)
      }
      switch (type) {
        case 0:
          vm.cardMoney[0].money = value.toString()
          break
        case 1:
          vm.cardMoney[1].money = value.toString()
          break
        case 2:
          vm.money = value.toString()
          break
        case 3:
          vm.lostMoney = value.toString()
          break
      }
    },
    showTime (type) {
      this.show = type
      this.type = type
    },
    getTime () {
      let vm = this
      vm.show = 0
    },
    city (type) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '490004',
        '41': type,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.loading = false
          if (res.data[39] === '00') {
            if (type === 0) {
              JSON.parse(res.data[38]).map((x, i) => {
                vm.cityList.push({
                  value: x.id,
                  label: x.divisionName,
                  children: []
                })
              })
            } else {
              vm.cityList.map((c, z) => {
                if (c.value === type) {
                  c.children = []
                  JSON.parse(res.data[38]).map((y, w) => {
                    c.children.push({
                      value: y.id,
                      label: y.divisionName
                    })
                  })
                }
              })
            }
          }
        })
        .catch(err => {
          vm.loading = false
          console.log(err)
        })
    },
    bSort (arr) {
      let len = arr.length
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (Date.parse(arr[j].replace(/-/g, '/')) > Date.parse(arr[j + 1].replace(/-/g, '/'))) {
            let temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    },
    merchantList (type) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '490006',
        '30': vm.cardList.bankId,
        '31': vm.children[0],
        '32': type,
        '33': vm.$route.query.acqcode,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.tradeList = JSON.parse(res.data[38])
            vm.calcoff()
          } else {
            vm.fullscreenLoading = false
            vm.$message({
              message: '该地区暂无商户，请重新选择',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'warning'
            })
            vm.refer = 0
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async todo (begin, end) { // 日期范围之内
      let vm = this
      var arr = []
      var ab = begin.split('-')
      var ae = end.split('-')
      var db = new Date()
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
      var de = new Date()
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
      var unixDb = db.getTime() - 24 * 60 * 60 * 1000
      var unixDe = de.getTime() - 24 * 60 * 60 * 1000
      for (var k = unixDb; k <= unixDe;) {
        k = k + 24 * 60 * 60 * 1000
        arr.push(vm.$moment(new Date(parseInt(k))).format('YYYY-MM-DD'))
      }
      vm.dateList = arr
    },
    async calculation () {
      let vm = this
      if (vm.money.match(/^[ ]*$/)) {
        vm.$message({
          message: '金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (!(Number(vm.money) <= 200000 && Number(vm.money) >= 500)) {
        vm.$message({
          message: '还款金额不能低于500,不能超过2000000',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.children.length === 0) {
        vm.$message({
          message: '必须选择商户地区',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.children.length === 0) {
        vm.$message({
          message: '必须选择商户地区',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (this.cardArr.length === 0) {
        vm.$message({
          message: '至少选择一张副卡',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.lostMoney.match(/^[ ]*$/)) {
        vm.$message({
          message: '主卡剩余可用金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (Number(vm.lostMoney) < 500) {
        vm.$message({
          message: '主卡剩余可用金额不能低于500',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.cardMoney[0].money.match(/^[ ]*$/)) {
        vm.$message({
          message: '副卡还款金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.cardMoney[1].money.match(/^[ ]*$/) && this.cardArr.length === 2) {
        vm.$message({
          message: '二副卡还款金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      vm.changeNum = 0
      vm.fullscreenLoading = true
      await vm.merchantList(vm.children[1])
    },
    calcoff () {
      let vm = this
      let newCardNoArr = []
      newCardNoArr.push({
        'bankAccount': this.cardList.BANK_ACCOUNT,
        'debtMoney': this.money,
        'balanecMoney': this.lostMoney,
        'endDate': this.$moment().day() >= this.cardList.REPAYMENT_DAY ? `0${this.$moment().add(1, 'months').month() + 1}-${this.cardList.REPAYMENT_DAY}` : `0${this.$moment().month() + 1}-${this.cardList.REPAYMENT_DAY}`,
        'bankId': this.cardList.bankId
      })
      console.log(newCardNoArr)
      this.cardArr.map((item, index) => {
        this.cardListArr.forEach(itemSon => {
          if (item.BANK_ACCOUNT === itemSon.BANK_ACCOUNT) {
            newCardNoArr.push({
              'bankAccount': itemSon.BANK_ACCOUNT,
              'debtMoney': vm.cardMoney[index].money,
              'balanecMoney': '',
              'endDate': this.$moment().day() >= itemSon.REPAYMENT_DAY ? `0${this.$moment().add(1, 'months').month() + 1}-${itemSon.REPAYMENT_DAY}` : `0${this.$moment().month() + 1}-${itemSon.REPAYMENT_DAY}`,
              'bankId': itemSon.bankId
            })
          }
        })
      })
      let parmas = {
        '0': '0700',
        '3': '193000',
        '5': '0',
        '9': '1',
        '13': '1',
        '35': document.querySelector('.el-cascader .el-input__inner').value.replace(/\s*/g, ''),
        '40': JSON.stringify(newCardNoArr),
        '41': vm.children[1],
        '42': vm.merchantNo,
        '43': vm.$route.query.acqcode,
        '59': vm.version
      }
      let url = vm.$mdata.mdGet(parmas)
      vm.$http.post(`request.app`, url)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.showCalc = 1
            vm.refer = 1
            vm.calcList = res.data
            this.$set(this, 'calcList', res.data)
            this.payFee = this.calcList[41]
            vm.planItem = JSON.parse(vm.calcList[57])
            vm.$stact.commit('SET_SB', { 7: res.data[7], 9: res.data[9], 11: res.data[11], 13: res.data[13], 14: res.data[14], 15: res.data[15] })
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
          console.log(err)
        })
    },
    async sumbitRefer () {
      let vm = this
      if (vm.changeNum === 1 && Number(vm.$route.query.keep) === 1) {
        vm.$message({
          message: '请重新计算周转金',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      vm.$stact.commit('SET_PLAN', vm.planItem)
      vm.$router.push({ name: 'ykdpre', query: { acqcode: vm.$route.query.acqcode, tong: vm.tong, merchantNo: vm.usermerchantNo, ykdhFlag: true } })
    },
    async calcSmall () {
      let vm = this
      if (vm.money.match(/^[ ]*$/)) {
        vm.$message({
          message: '金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (!(Number(vm.money) <= 200000 && Number(vm.money) >= 500)) {
        vm.$message({
          message: '还款金额不能低于500,不能超过2000000',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.dates.length < 1) {
        vm.$message({
          message: '必须选择日期',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.children.length === 0) {
        vm.$message({
          message: '必须选择商户地区',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      vm.changeNum = 0
      await vm.merchantList(vm.children[1])
      // await vm.todo(vm.searchTime, vm.endTime)
      vm.dateList = []
      vm.dateList = await vm.bSort(vm.dates)
      vm.searchTime = vm.dateList[0]
      vm.endTime = vm.dateList[vm.dates.length - 1]
      vm.fullscreenLoading = true
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '390048',
        '7': vm.value,
        '8': vm.money,
        '10': vm.dateList.toString(),
        '11': vm.cardList.BANK_ACCOUNT,
        '12': vm.cardList.ID,
        '23': 2,
        '42': vm.merchantNo,
        '43': vm.$route.query.acqcode,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.showCalc = 1
            vm.refer = 1
            vm.calcList = res.data
            this.payFee = this.calcList[41]
            vm.planItem = JSON.parse(vm.calcList[57])
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
          console.log(err)
        })
    },
    handleChange (value, label) {
      if (document.querySelector('.el-cascader__dropdown')) {
        document.querySelector('.el-cascader__dropdown').style.display = 'block'
      }
      this.loading = true
      this.city(value[0])
    },
    next (type) {
      let vm = this
      vm.centerDialogVisible = false
      switch (type) {
        case 1:
          // vm.showCalc = 1
          // vm.refer = 1
          vm.$router.push({ name: 'submit', query: { calcList: JSON.stringify(vm.calcList), children: vm.children, cardList: JSON.stringify(vm.cardList), value: vm.value, valuex: vm.valuex, acqcode: vm.$route.query.acqcode, rate: vm.$route.query.rate, planItem: JSON.stringify(vm.planItem), searchTime: vm.searchTime, endTime: vm.endTime, money: vm.money, area: document.querySelector('.el-cascader .el-input__inner').value.replace(/\s*/g, ''), merchantNo: vm.usermerchantNo } })
          break
        case 2:
          vm.$router.push({ name: 'upgrade' })
          break
      }
    }
  }
}
</script>
